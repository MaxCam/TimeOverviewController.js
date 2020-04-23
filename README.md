TimeOverviewController.js
=========================

This is a simple and easy to use time overview controller


## How to initialise it

```javascript
var timeOverview = new TimeOverviewView(
    {
        margins: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },

        granularityLevels: {
            "day": 43200 * 0.5, // 1 tick =  1 day if the total time window is within 0.5 month
            "week": 43200 * 5, // 1 tick =  1 week if the total time window is within 5 month
            "month": (43200 * 12 * 1) // 1 tick =  1 month if the total time window is within 1 year
        },
        verticalLabels: true,
        format: d3.time.format("%Y-%m-%d"),
        width: 1024,
        height: 100

    },

    function(startDate, endDate){
        // Your code th update your visualisation
    }
    , this);
```
## How to start it

```javascript
timeOverview.init(domElement, [totalStartTime, totalEndTime], [selectionStartDate, selectionEndDate]);
```

## How to update it

```javascript
timeOverview.update([env.measurementStartTime, env.measurementEndTime], [env.params.startDate, env.params.endDate]);
```
or
```javascript
timeOverview.updateSelection(startDate, endDate);
```

