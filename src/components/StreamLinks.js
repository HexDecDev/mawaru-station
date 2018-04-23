import React, { Component } from 'react';
import { List, Header } from 'semantic-ui-react'

class StreamLinks extends Component
{
    render(){
        return(
            <div id = "StreamLinks">
                <Header size='medium'>Ссылки на потоки:</Header>
                <List>
                    <List.Item>
                    <List.Icon name='battery full' />
                    <List.Content>
                        <List.Header as='a' href='http://mawaru.party:8000/mawaru.ogg.m3u' target = '_blank' >Основной поток (OGG/Quality:0.5)</List.Header>
                        <List.Description>Наивысшее качество. Именно этот поток играет в плеере выше. <b>Рекомендуется</b></List.Description>
                    </List.Content>
                    </List.Item>
                    <List.Item>
                    <List.Icon name='battery high' />
                    <List.Content>
                        <List.Header as='a' href='http://mawaru.party:8000/mawaru128.mp3.m3u' target = '_blank' >Вспомогательный поток (MP3/128kbps)</List.Header>
                        <List.Description>
                        Второй по качеству. Несколько лет был основным и неплохо себя показал. <b>Рекомендуется, если у Вас проблемы с OGG</b>
                        </List.Description>
                    </List.Content>
                    </List.Item>
                    <List.Item>
                    <List.Icon name='battery half' />
                    <List.Content>
                        <List.Header as='a' href='http://mawaru.party:8000/mawaru64.mp3.m3u' target = '_blank'>Для плохого интернета (MP3/64kbps)</List.Header>
                        <List.Description>Качество в два раза хуже предыдущего. Особо не тестировался, но наверное <b>сойдет при плохом соединении на 3G модемах</b></List.Description>
                    </List.Content>
                    </List.Item>
                    <List.Item>
                    <List.Icon name='battery low' />
                    <List.Content>
                        <List.Header as='a' href='http://mawaru.party:8000/mawaru24.mp3.m3u' target = '_blank'>EDGE Way (MP3/24kbps)</List.Header>
                        <List.Description>Работает, когда не работают другие. 
                                            Проверен подмосковными электричками.
                                            А еще создает ламповую атмосферу через херовые китайские динамики.  
                                             <b> Для мест, где кроме EDGE не поймать ничего.</b>
                                            </List.Description>
                    </List.Content>
                    </List.Item>
                </List>
            </div>
        );
    }
}

export default StreamLinks;