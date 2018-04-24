# Mawaru Station Front/Backend repo
Исходный код интернет-радио [Mawaru Station](http://mawaru.party/)

### С чем имеем дело
Так сложилось исторически, что сервер интернет-радиостанций [liquidsoap](http://liquidsoap.info) не умеет в нормальную отдачу информации о том, что вообще внутри него происходит. Есть только два канала связи с ним -  telnet и unix-socket.
Для адекватного вывода информации необходима своя прослойка. 
Это - один из вариантов её реализации с применением NоdeJS и React.

#### На чем работает Mawaru Station
* Liquidsoap 1.3.3
* Icecast 2.4.3
* Сожержимое этого репозитория

## Back-end

### Icecast2
Установить и настроить айскаст2 несложно.

#### Установка
```
apt-get install icecast2
```
#### Настройка
Файл конфигурации лежит тут: `/etc/icecast2/icecast.xml`

Примерное содержание должно быть таким

```
<icecast>
    <location>Moon</location>
    <admin>icemaster@localhost</admin>
    <limits>
        <clients>1000</clients>
        <sources>8</sources>
        <queue-size>524288</queue-size>
        <client-timeout>30</client-timeout>
        <header-timeout>15</header-timeout>
        <source-timeout>10</source-timeout>
        <burst-on-connect>1</burst-on-connect>
        <burst-size>65535</burst-size>
    </limits>

    <authentication>
        <source-password>---</source-password><!-- пароль -->
        <relay-password>---</relay-password><!-- пароль -->
        <admin-user>---</admin-user><!-- логин -->
        <admin-password>---</admin-password><!-- пароль -->
    </authentication>

    <hostname>---</hostname><!-- Имя сервера -->
    
    <listen-socket>
        <port>---</port><!-- порт -->
    </listen-socket>

    <http-headers>
        <header name="Access-Control-Allow-Origin" value="*" />
    </http-headers>

    <mount>
        <mount-name>/---</mount-name><!-- Имя маунта -->
        <username>---</username><!-- логин -->
        <password>---</password><!-- пароль -->
        <charset>cp1251</charset><!-- Лучше так, меньше проблем с тегами -->
    </mount>

    <fileserve>1</fileserve>

    <paths>
        <basedir>/usr/share/icecast2</basedir>
        <logdir>/var/log/icecast2</logdir>
        <webroot>/usr/share/icecast2/web</webroot>
        <adminroot>/usr/share/icecast2/admin</adminroot>
        <alias source="/" destination="/status.xsl"/>
    </paths>

    <logging>
        <accesslog>access.log</accesslog>
        <errorlog>error.log</errorlog>
        <loglevel>3</loglevel>
        <logsize>10000</logsize>
    </logging>

    <security>
        <chroot>0</chroot>
    </security>
</icecast>
```
После правки конфига, созраняем его и делаем `service icecast2 restart` \
Проверяем доступность, вбив в браузере в адресной строке адрес:порт, если появилась статистика сервера, значит можно идти дальше.

### Liquidsoap
Тут уже не все так просто и придется повозиться

#### Установка

Всегда есть простой путь
```
apt-get install liquidsoap
```
Но стоит помнить одну вещь - в репозиториях устаревшая версия 1.1.1. Mawaru Station работает на версии 1.3.3 и я не могу гарантировать, что код совместим с ней. К тому же, у этой версии много багов (из того, что у меня было - некорректные веса при рандомизации треков и джинглов, играет порой по три джингла и один трек,  не работал смарт кроссфейд ну и что-то еще, я уже и не помню). \
Поэтому я рекомендовал бы поставить жидкое мыло из исходников. Правда придется запастись терпением, чтобы установить все зависимости. Исходники и инструкции: https://github.com/savonet/liquidsoap

#### Настройка

Нормальных гайдов по конфигурированию почти нет, поэтому построчно разберу свой файл конфига и на его основе можно будет создать свой.
Итак, создаем папку, где будем хранить треки, логи и сам конфиг (например `/var/radio`).
Далее создаем там файл `nano start.liq` и приступаем к написанию конфигурации.

##### Включаем логи
Думаю, тут пояснять ничего не нужно.
```
set("log.file.path","/var/radio/radios.log")
set("log.stdout", true)
set("log.level",3) 
```


##### Кодировка тегов
Только так и никак иначе. 
```
set("tag.encodings",["UTF-8"])
```

##### Включаем telnet
Если хотите иметь доступ извне, то **127.0.0.1** нужно заменить на реальный айпи сервера. Но стоит помнить, что **никакой защиты у телнета нет и любой Васян сможет взять контроль за вашим вещанием**
```
set("server.telnet", true)
set("server.telnet.bind_addr","127.0.0.1")
set("server.telnet.port",5657)
set("server.telnet.reverse_dns",false)
```

##### Активируем возможность вещать вживую.
Для этого нам понадобится софт типа SAM Broadcaster. Инструкции для него можно нагуглить без проблем.
```
set("harbor.bind_addr","0.0.0.0")
live = audio_to_stereo(input.harbor(id="---", port=---, password="---", "---"))
liveover = audio_to_stereo(input.harbor(port=---, password="---", "---"))
```
Если хотите полностью перекрыть поток, то айди указывается. Если хотите вещать поверх - айди опускается. \
Последние кавычки - имя маунта для соединения (его нужно будет вбивать в программе для вещания, вместе с портом и паролем).

##### Рерайтим теги
Иногда нам не нужно, чтобы определенный плейлист транслировал теги. Например, в джинглах. Можно их переписать на свое сообщение. \
Пример того, как это работает на Mawaru Station:
```
def jin_tag(j)
   rewrite_metadata([("title","Mawaru radio!")], update=false, strip=true, j)
end
```


##### Формируем плейлисты
В корневой папке создаем папки для музыки и скидываем туда треки. Можно целыми каталогами, liquidsoap вытащит все, что найдет. \
Например так:
```
#Music playlists
day = audio_to_stereo(playlist("/var/radio/music"))
night = audio_to_stereo(night_tag(playlist("/var/radio/night")))

#Jingle playlist
jin = audio_to_stereo(jin_tag(playlist("/var/radio/jin")))
```













Ничего особо сложного или сверхестественного, достаточно изучить то, какие ответы возвращает telnet и правильно их парсить.
Однако некоторые вещи не очевидны. \
\
Например, на запрос `mountpoint.status` вернется только on/off в зависимости играет ли поток. Информацию о текущем треке вытаскивать нужно из `mountpoint.metadata`(желательно) или `playlist.next`(не стоит).\
\
Если хочется управлять сервером через API, то стоит помнить, что перемешивание треков происходит через `playlist.reload` (его так же нужно вызывать при добавлении новых треков в каталог с музыкой. А вот пропуск через `mountpoint.skip`, вне зависимости от того, какой плейлист сейчас "в воздухе". Кстати, если маунтов несколько, то не важно к какому делать запрос.\
\
OGG/Vorbis, по моему мнению, предпочтительнее для работы с тегами, но это мое мнение.\
\
Исполнителя и название трека мы берем из тегов OGG потока. Если тегов нет, то в название трека летит название файла (на фронте исполнитель заменяется заглушкой).\
\
Все данные, полученные от нескольких запросов пишутся в MongoDB, откуда формируются в один JSON и отдаются по единственному роуту. Выглядит это примерно [так](http://mawaru.party:3001/status).
