const express = require('express');
const efaAPI = require('./efaAPI');

const app = express();

app.get('/', (req, res) => (
    efaAPI.stopDetailApi().then(result => res.send(result))
));

app.listen(3000, function () {
  console.log('Belfast Glider API Server - listening on port 3000');
});
