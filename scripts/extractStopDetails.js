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
        console.log('error obtaining list of stops', err)
    ))
);

const filterGlideStops = stops => (
    stops.filter(r => stopNames.all.includes(r.name))
)

const writeResultToFile = filename => stops => {
    fs.writeFile(filename, JSON.stringify(stops, null, 4));
    return stops;
}

const filterDupes = stops => {
    const highestStopId = {}
    stops.forEach(s => highestStopId[s.name] = Math.max(highestStopId[s.name] || 0, parseInt(s.id)));
    return stops.filter(s => highestStopId[s.name] === parseInt(s.id));
};

const findDupes = stops => {
    const stopNames = stops.map(s => s.name);
    const duplicates = stops.filter(s => stopNames.indexOf(s.name) !== stopNames.lastIndexOf(s.name));
    const orderedDuplicates = duplicates.sort((a, b) => a.name.localeCompare(b.name));
    console.log('Duplicates:', orderedDuplicates);
    return orderedDuplicates
}

getAllStops()
//.then(writeResultToFile('./data/.all.json'))
.then(filterGlideStops)
.then(filterDupes)
.then(writeResultToFile('./data/stops.json'))
.then(findDupes)
.then(writeResultToFile('./data/.dupes.json'))
.catch(err => console.log('An error occured', err));
