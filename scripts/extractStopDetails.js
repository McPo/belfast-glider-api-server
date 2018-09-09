const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');
const stopNames = require('../data/stopNames');

const efaXMLStopsToFriendlyJson = xmlInput => (
    new Promise((resolve, reject) => {
        xml2js.parseString(xmlInput, (err, result) => {
            if (err) reject(err)
            else resolve(
            result.itdRequest.itdStopListRequest[0].itdOdv.map(i => ({
                name: i.itdOdvName[0].odvNameElem[0]._,
                id: i.itdOdvName[0].odvNameElem[0].$.stopID,
                lat: i.itdCoord[0].$.x,
                long: i.itdCoord[0].$.y
            })))
        })
    })
);

const getAllStops = () => (
    axios({
        url: 'http://journeyplanner.translink.co.uk/web/XML_STOPLIST_REQUEST',
        method: 'GET',
        responseType: 'text'
    })
    .then(response => efaXMLStopsToFriendlyJson(response.data))
    .catch(err => (
        console.error('error obtaining list of stops', err)
    ))
);

const filterGlideStops = stops => (
    stops.filter(r => stopNames.all.includes(r.name))
)

const writeResultToFile = filename => stops => {
    fs.writeFile(filename, JSON.stringify(stops, null, 4));
    return stops;
}

const addGlideRouteInfo = stops => (
    stops.map(s => ({
        ...s,
        g1: stopNames.g1.includes(s.name),
        g2: stopNames.g2.includes(s.name)
    }))
);

const filterDupes = stops => {
    const highestStopId = {}
    stops.forEach(s => highestStopId[s.name] = Math.max(highestStopId[s.name] || 0, parseInt(s.id)));
    return stops.filter(s => highestStopId[s.name] === parseInt(s.id));
};

const findDupes = stops => {
    const currentStopNames = stops.map(s => s.name);
    const duplicates = stops.filter(s => currentStopNames.indexOf(s.name) !== currentStopNames.lastIndexOf(s.name));
    const orderedDuplicates = duplicates.sort((a, b) => a.name.localeCompare(b.name));
    console.info('Duplicates:', orderedDuplicates);
    return orderedDuplicates
};

const findMissing = stops => {
    const currentStopNames = stops.map(s => s.name);
    const missing = stopNames.all.filter(s => !currentStopNames.includes(s));
    console.info('Missing:', missing);
    return stops
};

const verifyAmount = stops => {
    g1Count = stops.filter(s => s.g1).length;
    g2Count = stops.filter(s => s.g2).length;
    g1OK = g1Count == stopNames.g1.length;
    g2OK = g2Count == stopNames.g2.length;
    if (g1OK && g2OK) console.log('OK');
    else console.error(`Incorrect number of stops: G1=${g1Count}/${stopNames.g1.length}, G2=${g2Count}/${stopNames.g2.length}`);
    return stops;
};

getAllStops()
.then(writeResultToFile('./data/.all.json'))
.then(filterGlideStops)
.then(filterDupes)
.then(addGlideRouteInfo)
.then(writeResultToFile('./data/stops.json'))
.then(verifyAmount)
.then(findMissing)
.then(findDupes)
.then(writeResultToFile('./data/.dupes.json'))
.catch(err => console.error('An error occured', err));
