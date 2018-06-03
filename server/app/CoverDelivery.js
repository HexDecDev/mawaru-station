var LastfmAPIKey = '---'; //Сюда втыкаете ваш ключ


export function updateCover(connection, params, axios, download)
{
    connection.connect(params);
    connection.send('MAWARU!_Radio.1.metadata', {ors: '\r\n', waitfor: 'END'}, function(err, telres) {
        //Oh boy, here we go
        //Grabbing first song
        //--- 1 ---
        var firstSongInfo = telres.split('--- 1 ---');
        //Spltting new lines
        if (firstSongInfo[1])
        {
        var splitArray = firstSongInfo[1].split('\n');

        //Grabbing data
        //IDK if here is a way to do this better

        var playingfile, artist, title;
        
        for (var q = 0; q < splitArray.length; ++q)
        {
            var val = splitArray[q];
            if (val.indexOf("initial_uri=") >= 0)
            {
                playingfile = val.substring(val.lastIndexOf("/")+1,val.lastIndexOf(".mp3"));
            }

            if (val.indexOf("title=") >= 0)
            {
                title = val.substring(val.lastIndexOf("title=")+7,val.lastIndexOf("\""));
            }

            if (val.indexOf("artist=") >= 0)
            {
                //artist = val;
                artist = val.substring(val.lastIndexOf("artist=")+8,val.lastIndexOf("\""));
            }
        }

        var searchQuery; //Forming a request to lastfm
        
        if (artist &&  title) searchQuery = artist + " - " + title;
        else searchQuery = playingfile;
        
        var lastfmlink = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + searchQuery + '&api_key=' + LastfmAPIKey + '&format=json'
        lastfmlink.replace("#", "-"); //Без этого вам пиздец
        axios.get(unescape(encodeURIComponent(lastfmlink))).then(function (response) {

            var downloadURL = (response.data.results.trackmatches.track[0] && response.data.results.trackmatches.track[0].image[3]["#text"]) ? response.data.results.trackmatches.track[0].image[3]["#text"] : 'http://mawaru.party:3001/covers/default.jpeg';
            var destFile = './covers/album.png';
            
            if (title === 'Mawaru radio!') downloadURL = 'http://mawaru.party:3001/covers/default.jpeg';
            download.image({url:downloadURL, dest: destFile})
            .then(({ filename, image }) => {
                
            }).catch((err) => {
                throw err
            })
          }).catch((err) => {
            throw err
        })
        }
      })
      
}