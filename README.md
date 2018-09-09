# Belfast Glider API Server

A simple wrapper around Translinks EFA API to reduce the complecity of working with the API.

# Usage

```
/list/
```

Returns a list of G1 and G2 Glider stops, including their id, name, latitude and longitude.

```
/stop/:id
```

Returns a list of departures from a specific stop, includes real time information if available.

# Todo
- Add Feeder Services
- Reduce size of EFA response object (Lots of redundant information)