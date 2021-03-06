
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
    ? [ efaFriendlyDeparture(departureList.departure) ]
    : departureList.map(efaFriendlyDeparture)
);

const efaFriendlyStop = stop => ({
    name: stop.itdOdvAssignedStops.name,
    id: parseInt(stop.itdOdvAssignedStops.stopID),
    lat: parseFloat(stop.itdOdvAssignedStops.y),
    lng: parseFloat(stop.itdOdvAssignedStops.x)
});

const validEFAGliderStop = efaResponse => (
    Boolean(efaResponse.dm.itdOdvAssignedStops) // Check valid stop
    && Boolean(efaResponse.departureList) // Check valid glider stop
);

const efaFriendly = efaResponse => {
    if (!validEFAGliderStop(efaResponse)) {
        throw 'Invalid Glider Stop';
    }

    return {
        dateTime: efaDateToString(efaResponse.dateTime),
        stop: efaFriendlyStop(efaResponse.dm),
        departures: efaFriendlyDepartureList(efaResponse.departureList)
    };
};

module.exports = efaFriendly;
