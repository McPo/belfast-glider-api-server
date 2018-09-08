const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');
const stopNames = require('../data/stopNames');

const getAllStops = () => (
    axios({
        url: 'http://journeyplanner.translink.co.uk/web/XML_STOPLIST_REQUEST',
        method: 'GET',
        responseType: 'text'
    })
    .then(response => new Promise((resolve, reject) => {
        xml2js.parseString(response.data, (err, result) => {
            if (err) reject(err)
            else resolve(
            result.itdRequest.itdStopListRequest[0].itdOdv.map(i => ({
                name: i.itdOdvName[0].odvNameElem[0]._,
                id: i.itdOdvName[0].odvNameElem[0].$.stopID,
                lat: i.itdCoord[0].$.x,
                long: i.itdCoord[0].$.y
            })))
        })
    }))
    .catch(err => (
        console.log('error obtaining list of stops', err)
    ))
);

getAllStops()
.then(result => {
    fs.writeFile("./data/.all.json", JSON.stringify(result));
    return result;
})
.then(result => result.filter(r => stopNames.all.includes(r.name)))
.then(result => console.log(result));
