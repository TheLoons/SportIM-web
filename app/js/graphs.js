function barChart(element, data) {
    var barWidth = 50;
    var width = (barWidth + 10) * data.length;
    var height = 200;

    var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
    var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.count; })]).
        rangeRound([0, height]);

    // add the canvas to the DOM
    var barDemo = d3.select(element).
        attr("width", width).
        attr("height", height);

    barDemo.selectAll().
        data(data).
        enter().
        append("svg:rect").
        attr("x", function(datum, index) { return x(index); }).
        attr("y", function(datum) { return height - y(datum.count) - 30; }).
        attr("height", function(datum) { return y(datum.count); }).
        attr("width", barWidth).
        attr("fill", function(datum) { return datum.color; }).
        on("mouseover", function() {
            d3.select(this).attr("fill", function(datum) {return datum.highlightColor});
        }).
    on("mouseout", function() {
        d3.select(this).attr("fill", function(datum) {return datum.color});
    });

    barDemo.selectAll().
        data(data).
        enter().
        append("text").
        attr("x", function(datum, index) { return x(index) + 25; }).
        attr("y", function(datum) { return d3.max([10, height - y(datum.count) - 20]); }).
        attr("dy", ".75em").
        attr("text-anchor", "middle").
        text(function(datum) {return datum.count});

    barDemo.selectAll().
        data(data).
        enter().
        append("text").
        attr("x", function(datum, index) { return x(index) + 25; }).
        attr("y", function(datum) { return height - 20; }).
        attr("dy", ".75em").
        attr("text-anchor", "middle").
        text(function(datum) {return datum.label});
}

function pieChart(element, data) {
    var pie = new d3pie(element, {
        "size": {
            "canvasWidth": 300,
            "canvasHeight": 200,
            "pieInnerRadius": "50%",
            "pieOuterRadius": "100%"
        },
        "data": {
            "sortOrder": "value-desc",
            "content": data
        },
        "labels": {
            "outer": {
                "pieDistance": 12
            },
            "inner": {
                "hideWhenLessThanPercentage": 3
            },
            "mainLabel": {
                "fontSize": 11
            },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0
            },
            "value": {
                "color": "#adadad",
                "fontSize": 11
            },
            "lines": {
                "enabled": false
            }
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
            },
            "highlightSegmentOnMouseover": true,
            "highlightLuminosity": 0.1
        },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
            }
        }
    });
}
