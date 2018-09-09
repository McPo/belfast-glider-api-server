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

app.listen(3000, function () {
  console.log('Belfast Glider API Server - listening on port 3000');
});
