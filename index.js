const express = require('express');
const efaAPI = require('./efaAPI');
const stops = require('./data/stops');

const app = express();

app.get('/', (req, res) => {
    if (req.query.id) {
        efaAPI.stopDetailApi(req.query.id, req.query.limit)
        .then(result => res.send(result));
    } else {
        res.send(stops);
    }
});

app.listen(3000, function () {
  console.log('Belfast Glider API Server - listening on port 3000');
});
