const axios = require('axios');

var express = require('express');
var app = express();

const efaDateToString = dateTimeObject => (
    dateTimeObject ? new Date(
        dateTimeObject.year,
        dateTimeObject.month,
        dateTimeObject.day,
        dateTimeObject.hour,
        dateTimeObject.minute
    ) : null
);

const efaFriendlyDeparture = departure => ({
    from: departure.servingLine.directionFrom,
    to: departure.servingLine.direction,
    min_until: parseInt(departure.countdown),
    scheduled: efaDateToString(departure.dateTime),
    estimated: efaDateToString(departure.realDateTime),
});

const efaFriendlyDepartureList = departureList => (
    departureList.departure
    ? efaFriendlyDeparture(departureList.departure)
    : departureList.map(efaFriendlyDeparture)
);

const efaFriendlyStop = stop => ({
    name: stop.itdOdvAssignedStops.name,
    id: stop.itdOdvAssignedStops.stopId,
    lat: stop.itdOdvAssignedStops.x,
    long: stop.itdOdvAssignedStops.y
});

const efaFriendly = efaResponse => ({
    dateTime: efaDateToString(efaResponse.dateTime),
    stop: efaFriendlyStop(efaResponse.dm),
    departures: efaFriendlyDepartureList(efaResponse.departureList)
})

const generateStopUrl = (stopId, limit) => (
    `http://journeyplanner.translink.co.uk/android/XML_DM_REQUEST?mode=direct&sessionID=0&requestID=0&name_dm=${stopId}&dmMacroNIR=true&deleteAssignedStops_dm=1&type_dm=any&_=1536414335130&includedMeans=7&useRealtime=1${ limit ? '&limit=1' : ''}`
);

const stopDetailApi = stopId => (
    axios.get(generateStopUrl(10011588, 1))
    .then(response => ({
        status: 'ok',
        ...efaFriendly(response.data)
    }))
    .catch(err => ({
        status: 'error',
        reason: err.toString()
    }))
);

app.get('/', (req, res) => (
    stopDetailApi().then(result => res.send(result))
));

app.listen(3000, function () {
  console.log('Belfast Glider API Server - listening on port 3000');
});
