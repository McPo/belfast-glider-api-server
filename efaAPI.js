const axios = require('axios');
const efaFriendly =  require('./efaFriendly')

const stopDetailApi = (stopId, limit) => (
    axios({
        url: 'http://journeyplanner.translink.co.uk/web/XML_DM_REQUEST',
        method: 'GET',
        params: {
            _:1536414335130,
            sessionID: 0,
            requestID: 0,
            dmMacroNIR: true,
            mode: 'direct',
            type_dm: 'any',
            deleteAssignedStops_dm: 1,
            includedMeans: 7,
            name_dm: stopId,
            limit
        }
    })
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
