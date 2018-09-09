const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');
const stopIds = require('../data/stopIds');

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
    stops.filter(r => stopIds.all.includes(r.id))
)

const writeResultToFile = filename => stops => {
    fs.writeFile(filename, JSON.stringify(stops, null, 4));
    return stops;
}

const addGlideRouteInfo = stops => (
    stops.map(s => ({
        ...s,
        g1: stopIds.g1.includes(s.id),
        g2: stopIds.g2.includes(s.id)
    }))
);

const verifyAmount = stops => {
    g1Count = stops.filter(s => s.g1).length;
    g2Count = stops.filter(s => s.g2).length;
    g1OK = g1Count == stopIds.g1.length;
    g2OK = g2Count == stopIds.g2.length;
    if (g1OK && g2OK) console.log('OK');
    else console.error(`Incorrect number of stops: G1=${g1Count}/${stopIds.g1.length}, G2=${g2Count}/${stopIds.g2.length}`);
    return stops;
};

getAllStops()
.then(writeResultToFile('./data/.all.json'))
.then(filterGlideStops)
.then(addGlideRouteInfo)
.then(writeResultToFile('./data/stops.json'))
.then(verifyAmount)
.catch(err => console.error('An error occured', err));
