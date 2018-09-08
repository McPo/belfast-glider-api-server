const axios = require('axios');

var express = require('express');
var app = express();

const generateStopUrl = () => (
    'http://journeyplanner.translink.co.uk/android/XML_DM_REQUEST?mode=direct&sessionID=0&requestID=0&name_dm=10011588&dmMacroNIR=true&deleteAssignedStops_dm=1&type_dm=any&_=1536414335130&includedMeans=7&useRealtime=1'
);

app.get('/', function (req, res) {
    axios.get(generateStopUrl())
    .then(response => {
        result = response.data.departureList.map(d => ({
            from: d.servingLine.directionFrom,
            to: d.servingLine.direction,
            minutes_until: d.countdown,
            scheduled: new Date(d.dateTime.year, d.dateTime.month, d.dateTime.day, d.dateTime.hour, d.dateTime.minute),
            estimated: d.realDateTime ? new Date(d.realDateTime.year, d.realDateTime.month, d.realDateTime.day, d.realDateTime.hour, d.realDateTime.minute) : null
        }))
        res.send({ upcoming: result,
            stop: {
                name: response.data.dm.itdOdvAssignedStops.name,
                id: response.data.dm.itdOdvAssignedStops.stopId,
                lat: response.data.dm.itdOdvAssignedStops.x,
                long: response.data.dm.itdOdvAssignedStops.y
            }
        });
    })
    .catch(error => {
        console.log(error);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
