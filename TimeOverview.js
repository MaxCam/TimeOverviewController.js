/**
 * Author: Massimo Candela - massimocandela.com
 * This is an amd time overview controller.
 * This can provide a good time overview/management to the user while your tool is visualising ongly a small portion of it.
 */

define([
    "lib.d3"
], function(d3){

    var TimeOverviewView = function(options, callback, context){
        var domainRange, timeMapper, timeTicker, brusherBucketLevelsMinutes, timeGrid, margins, width, config,
            height, brush, xAxis, svg, groupOverview, currentSelection, timeUnitGrid, $this, margins, dom;

        $this = this;
        margins = options.margins;
        config = options.config;
        brusherBucketLevelsMinutes = options.granularityLevels;

        this.init = function(domElement, domainRange, currentSelection){
            dom = domElement;
            this.render(domainRange, currentSelection);
        };


        this._afterInteraction = function(){
            if (!d3.event.sourceEvent) return; // only transition after input
            var extent0, selectionPoints;

            extent0 = brush.extent();

            // Magnetic effect
            selectionPoints = extent0.map(timeUnitGrid.round);
            if (selectionPoints[0] >= selectionPoints[1]) {
                selectionPoints[0] = timeUnitGrid.floor(extent0[0]);
                selectionPoints[1] = timeUnitGrid.ceil(extent0[1]);
            }

            // Apply magnetic feedback
            d3.select(this).transition()
                .call(brush.extent(selectionPoints));

            callback.call(context, selectionPoints[0], selectionPoints[1]);
        };

        this._duringInteraction = function(){
            if (!d3.event.sourceEvent) return; // Only transitions after input
            var extent0, selectionPoints;

            extent0 = brush.extent();

            // Magnetic effect
            selectionPoints = extent0.map(timeUnitGrid.round);
            if (selectionPoints[0] >= selectionPoints[1]) {
                selectionPoints[0] = timeUnitGrid.floor(extent0[0]);
                selectionPoints[1] = timeUnitGrid.ceil(extent0[1]);
            }

            // Apply magnetic feedback
            d3.select(this).transition()
                .call(brush.extent(selectionPoints));
        };


        this.render = function(domainRange, currentSelection){

            this.domainRange = domainRange;

            if (domainRange[1] - domainRange[0] < (brusherBucketLevelsMinutes.day * 60 * 1000)){
                timeMapper = d3.time.day;
                timeTicker = d3.time.days;
                timeGrid = d3.time.hours;
                timeUnitGrid = d3.time.hour;
            }else if (domainRange[1] - domainRange[0] < (brusherBucketLevelsMinutes.week * 60 * 1000)){
                timeMapper = d3.time.week;
                timeTicker = d3.time.weeks;
                timeGrid = d3.time.days;
                timeUnitGrid = d3.time.day;
            }else if (domainRange[1] - domainRange[0] < (brusherBucketLevelsMinutes.month * 60 * 1000)){
                timeMapper = d3.time.month;
                timeTicker = d3.time.months;
                timeGrid = d3.time.weeks;
                timeUnitGrid = d3.time.week;
            }else{
                timeMapper = d3.time.year;
                timeTicker = d3.time.years;
                timeGrid = d3.time.months;
                timeUnitGrid = d3.time.month;
            }


            width = options.width;
            height = options.height - margins.top - margins.bottom;

            xAxis = d3
                .time
                .scale
                .utc()
                .domain(domainRange)
                .range([0, width]);

            brush = d3.svg.brush()
                .x(xAxis)
                .extent(currentSelection)
                //.on("brush", brushing)
                .on("brushend", $this._afterInteraction);

            svg = d3.select(dom)
                .append("svg")
                .attr("class", "brusher")
                .attr("width", width + margins.left + margins.right)
                .attr("height", height + margins.top + margins.bottom)
                .append("g")
                .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

            svg.append("rect")
                .attr("class", "grid-background")
                .attr("width", width)
                .attr("height", height);

            svg.append("g")
                .attr("class", "x grid")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.svg.axis()
                    .scale(xAxis)
                    .orient("bottom")
                    .ticks(timeGrid)
                    .tickSize(-height)
                    .tickFormat(""))
                .selectAll(".tick")
                .classed("minor", function(d) { return d.getHours(); });

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.svg.axis()
                    .scale(xAxis)
                    .orient("bottom")
                    .ticks(timeTicker)
                    .tickFormat(d3.time.format("%Y-%m-%d"))
                    .tickPadding(0))
                .selectAll("text")
                .attr("x", 6)
                .style("text-anchor", null);

            groupOverview = svg.append("g")
                .attr("class", "brush")
                .call(brush);

            groupOverview.selectAll("rect")
                .attr("height", height);

            svg.selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-1.2em")
                .attr("dy", ".15em")
                .attr('transform', 'rotate(-65)');
        };

        this.update = function(domainRange, currentSelection){
            d3.select(dom)
                .select(".brusher")
                .remove();

            this.render(domainRange, currentSelection);
        };

        this.updateSelection = function(startDate, endDate){
            d3.select(dom)
                .select(".brusher")
                .remove();

            this.render(this.domainRange, [startDate, endDate]);
        };
    };

    return TimeOverviewView;
});
