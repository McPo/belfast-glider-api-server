# Belfast Glider API Server

A simple third-party wrapper around Translinks EFA API to reduce the complexity of working with their API.

# Usage

```
/list
```

Returns a list of G1 and G2 Glider stops, including their id, name, x and y.

```
/stop/:id?[limit=1]
```

Returns a list of departures from a specific stop, includes real time information if available.

# Example
## List of Stops
<https://belfast-glider-api-server.herokuapp.com/list>

## Realtime Departures from May Street [City Hall]
<https://belfast-glider-api-server.herokuapp.com/stop/10003999>

# Todo
- Add Feeder Services
- Reduce size of EFA response object (Lots of redundant information)
