const express = require('express');
const efaAPI = require('./efaAPI');
const stops = require('./data/stops');

const app = express();

app.get('/list', (req, res) => (
    res.send({
        status: 'ok',
        stops
    })
));

app.get('/stop/:id', (req, res) => (
    efaAPI.stopDetailApi(req.params.id, req.query.limit)
    .then(result => res.send(result))
));

app.get('/overview', (req, res) => {
    Promise.all(stops.map(s => efaAPI.stopDetailApi(s['id'], 1)))
    .then(results => {
        const stops = results.map(r => ({
            name: r['stop'] ? r['stop']['name'] : null,
            min_until: r['departures'] ? r['departures'][0]['min_until'] : null
        }));
        res.send({
            status:'ok',
            stops
        });
    })
    .catch(err => {
        res.send({
            status:'error',
            reason: err.toString()
        });
    })
});

app.listen(3000, function () {
  console.log('Belfast Glider API Server - listening on port 3000');
});
