const axios = require('axios');
const xml2js = require('xml2js');

const getAllStops = () => (
    axios({
        url: 'http://journeyplanner.translink.co.uk/web/XML_STOPLIST_REQUEST',
        method: 'GET',
        responseType: 'text'
    })
    .then(response => {
        xml2js.parseString(response.data, (err, result) => {
            console.log(result.itdRequest.itdStopListRequest[0].itdOdv.map(
                itd0dv => ({
                    name: itd0dv.itdOdvName[0].odvNameElem[0]._,
                    id: itd0dv.itdOdvName[0].odvNameElem[0].$.stopID,
                    lat: itd0dv.itdCoord[0].$.x,
                    long: itd0dv.itdCoord[0].$.y
                })
            ));
            /*
            name: result.itdRequest.itdStopListRequest[0].itdOdv[0].itdOdvName[0].odvNameElem[0]._
            id: result.itdRequest.itdStopListRequest[0].itdOdv[0].itdOdvName[0].odvNameElem[0].$.stopId
            lat: result.itdRequest.itdStopListRequest[0].itdOdv[0].itdCoord[0].$.x
            long: result.itdRequest.itdStopListRequest[0].itdOdv[0].itdCoord[0].$.y
            */
        });
    })
    .catch(err => (
        console.log('error obtaining list of stops', err)
    ))
);

getAllStops().then(result => console.log(result));
