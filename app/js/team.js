var team = angular.module('team',['services']);

team.controller('teamc', function($scope, Team) {
    Team.get({id: 1}).$promise.then(function(resp) {
        $scope.team = resp.team;
    });

    $scope.players = [
        {name: "John Terry", position: "MF", goals: "11"},
        {name: "Test Player", position: "FW", goals: "2"},
        {name: "Awesome Guy", position: "MF", goals: "5"},
        {name: "Jonathan Guy", position: "CB", goals: "1"},
        {name: "Meta Player", position: "CM", goals: "11"},
        {name: "Tierry Honer", position: "GK", goals: "5"},
        {name: "Jack Dos", position: "CM", goals: "4"},
        {name: "Mana Kin", position: "LB", goals: "2"},
        {name: "Bob Cat", position: "RB", goals: "2"},
        {name: "Michel Gutierrez", position: "CB", goals: "7"},
        {name: "John Terry", position: "MF", goals: "11"},
        {name: "Test Player", position: "FW", goals: "2"},
        {name: "Awesome Guy", position: "MF", goals: "5"},
        {name: "Jonathan Guy", position: "CB", goals: "1"},
        {name: "Meta Player", position: "CM", goals: "11"},
        {name: "Tierry Honer", position: "GK", goals: "5"},
        {name: "Jack Dos", position: "CM", goals: "4"},
        {name: "Mana Kin", position: "LB", goals: "2"},
        {name: "Bob Cat", position: "RB", goals: "2"},
        {name: "Michel Gutierrez", position: "CB", goals: "7"}
    ];

    var data = [{year: 2006, books: 54},
                {year: 2007, books: 43},
                {year: 2008, books: 41},
                {year: 2009, books: 44},
                {year: 2010, books: 35}];

    var barWidth = 40;
    var width = (barWidth + 10) * data.length;
    var height = 200;

    var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
    var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.books; })]).
      rangeRound([0, height]);

    // add the canvas to the DOM
    var barDemo = d3.select("#goalChart").
      append("svg:svg").
      attr("width", width).
      attr("height", height);

    barDemo.selectAll("rect").
      data(data).
      enter().
      append("svg:rect").
      attr("x", function(datum, index) { return x(index); }).
      attr("y", function(datum) { return height - y(datum.books); }).
      attr("height", function(datum) { return y(datum.books); }).
      attr("width", barWidth).
      attr("fill", "#2d578b");

    var matrix = [
      [11975,  5871, 8916, 2868],
      [ 1951, 10048, 2060, 6171],
      [ 8010, 16145, 8090, 8045],
      [ 1013,   990,  940, 6907]
    ];

    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    var width = 560,
        height = 300,
        innerRadius = Math.min(width, height) * .41,
        outerRadius = innerRadius * 1.1;

    var fill = d3.scale.category20();

    var svg = d3.select("#passingChart")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g").selectAll("path")
        .data(chord.groups)
      .enter().append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    var ticks = svg.append("g").selectAll("g")
        .data(chord.groups)
      .enter().append("g").selectAll("g")
        .data(groupTicks)
      .enter().append("g")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + outerRadius + ",0)";
        });

    ticks.append("line")
        .attr("x1", 1)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 0)
        .style("stroke", "#000");

    ticks.append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .text(function(d) { return d.label; });

    svg.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); })
        .style("opacity", 1);

    // Returns an array of tick angles and labels, given a group.
    function groupTicks(d) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, 1000).map(function(v, i) {
        return {
          angle: v * k + d.startAngle,
          label: i % 5 ? null : v / 1000 + "k"
        };
      });
    }

    // Returns an event handler for fading a given chord group.
    function fade(opacity) {
      return function(g, i) {
        svg.selectAll(".chord path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
            .style("opacity", opacity);
      };
    }
});
