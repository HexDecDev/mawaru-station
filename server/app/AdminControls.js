export function skipTrack(connection, params, res)
{
    connection.connect(params);
    connection.send('MAWARU!_Radio.skip', {ors: '\r\n', waitfor: 'END'}, function(err, telres) {
        res.sendStatus(200);
      });
}

export function setRequest(connection, params, req, res)
{
    connection.connect(params);
    connection.send('request.push ' + req.body.link, {ors: '\r\n', waitfor: 'END'}, function(err, telres) {

        res.send(telres);
        //res.sendStatus(200);
      })
}

export function shuffleDay(connection, params, res)
{
    connection.connect(params);
    connection.send('music.reload', {ors: '\r\n', waitfor: 'END'}, function(err, telres) {
        res.sendStatus(200);
      })
}


export function shuffleNight(connection, params, res)
{
    connection.connect(params);
    connection.send('night.reload', {ors: '\r\n', waitfor: 'END'}, function(err, telres) {
        res.sendStatus(200);
      })
}