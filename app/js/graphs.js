function barChart(element, data, width, height) {
    var barWidth = (width/data.length) - 10;

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
        attr("x", function(datum, index) { return x(index)+10; }).
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
        attr("x", function(datum, index) { return x(index) + barWidth/2 + 10; }).
        attr("y", function(datum) { if(datum.count == 0) return height - 50; else return d3.max([10, height - y(datum.count) - 25]); }).
        attr("dy", ".75em").
        attr("text-anchor", "middle").
        text(function(datum) {return datum.count});

    barDemo.selectAll().
        data(data).
        enter().
        append("text").
        attr("x", function(datum, index) { return x(index) + 36; }).
        attr("y", function(datum) { return height - 20; }).
        attr("dy", ".75em").
        attr("text-anchor", "middle").
        text(function(datum) {return datum.label});
}

function pieChart(element, data, width, height) {
    var pie = new d3pie(element, {
        "size": {
            "canvasWidth": width,
            "canvasHeight": height,
            "pieInnerRadius": "40%",
            "pieOuterRadius": "80%"
        },
        "data": {
            "sortOrder": "value-desc",
            "content": data
        },
        "labels": {
            "outer": {
                "pieDistance": 4
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

function chordChart(element, data, labels, width, height) {
    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(data);

    var innerRadius = Math.min(width, height) * .41,
        outerRadius = innerRadius * 1.1;

    var colors = d3.scale.category20c();

    var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g").selectAll("path")
        .data(chord.groups)
        .enter().append("path")
        .attr("id", function(d){ return "path_"+d.index; })
        .style("fill", function(d) { return colors(d.index); })
        .style("stroke", function(d) { return colors(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return colors(d.target.index); })
        .style("opacity", 1);

    svg.append("g").selectAll("path")
        .data(chord.groups)
        .enter()
        .append("text")
        .append("textPath")
        .attr("xlink:href", function (d,i) { return "#path_" + i; })
        .text(function (d,i) { return labels[i]; })
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    // Returns an event handler for fading a given chord group.
    function fade(opacity) {
        return function(g, i) {
            svg.selectAll(".chord path")
                .filter(function(d) { return d.source.index != i && d.target.index != i; })
                .transition()
                .style("opacity", opacity);
        };
    }
}
