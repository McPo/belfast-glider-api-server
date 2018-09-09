const efaAPI = require('../efaAPI');
const stops = require('../data/stops');

const validateId = (id, name) => (
    efaAPI.stopDetailApi(id, 1).then(r => (
        r['status'] === 'ok' ? ({
            status: 'ok',
            id,
            name,
            min_until: r['departures'][0] ? r['departures'][0]['min_until'] : null
        }) : {
            status: 'error',
            id,
            name,
            min_until: null
        }
    ))
);

Promise.all(stops.map(s => validateId(s['id'], s['name'])))
.then(results => {
    const valid = results.filter(r => r.status == 'ok').map(r => r.name);
    const invalid = results.filter(r => r.status == 'error').map(r => r.name);
    if (invalid.length > 0) console.error('Invalid', invalid);
    else console.log('OK');
})
.catch(err => console.error('An Error occured', err));
