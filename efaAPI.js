const axios = require('axios');
const efaFriendly =  require('./efaFriendly')

const generateStopUrl = (stopId, limit) => (
    `http://journeyplanner.translink.co.uk/android/XML_DM_REQUEST?mode=direct&sessionID=0&requestID=0&name_dm=${stopId}&dmMacroNIR=true&deleteAssignedStops_dm=1&type_dm=any&_=1536414335130&includedMeans=7&useRealtime=1${ limit ? '&limit=1' : ''}`
);

const stopDetailApi = stopId => (
    axios.get(generateStopUrl(10011588, 1))
    .then(response => ({
        status: 'ok',
        ...efaFriendly(response.data)
    }))
    .catch(err => ({
        status: 'error',
        reason: err.toString()
    }))
);

module.exports = {
    stopDetailApi
}
