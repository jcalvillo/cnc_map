// JS

// print data to console
d3.json("data/uk.json", function(error, uk) {
  if (error) return console.error(error);
  console.log(uk);
});

// SVG setup
var width = 960,
    height = 1160;

var projection = d3.geo.mercator()

    .scale(1200 * 0.15)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);








// d3 code for map
d3.json("data/uk.json", function(error, uk) {
  var subunits = topojson.feature(uk, uk.objects.subunits),
      places = topojson.feature(uk, uk.objects.places);

  // countries
  svg.selectAll(".subunit")
      .data(subunits.features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.id; })
      .attr("d", path);

  // // country borders
  // svg.append("path")
  //     .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
  //     .attr("d", path)
  //     .attr("class", "subunit-boundary");

  // svg.append("path")
  //     .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
  //     .attr("d", path)
  //     .attr("class", "subunit-boundary IRL");

  // // country names
  // svg.selectAll(".subunit-label")
  //     .data(subunits.features)
  //   .enter().append("text")
  //     .filter(function(d) {return d.id == "USB" || d.id == "ESX" || d.id == "BRA" || d.id == "INX"})
  //     .attr("class", function(d) { return "subunit-label " + d.id; })
  //     .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d.properties.name; });
  
  // points
  svg.append("path")
      .datum(places)
      .attr("d", path)
      .attr("class", "place");

  // point labels
  svg.selectAll(".place-label")
      .data(places.features)
    .enter().append("text")
      .attr("class", "place-label")
      .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
      .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
      .attr("dy", ".35em")
      .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
      .text(function(d) { return d.properties.name; });
});
