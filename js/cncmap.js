// JS

//------------------------useful for dev--------------------------------------//

// // print data to console
// d3.json("data/world_places.json", function(error, world_places) {
//   if (error) return console.error(error);
//   console.log(world_places);
// });

//-------------------------set up container svg-------------------------------//

// SVG setup
var width = 960,
    height = 600;

// create a function that will scale+project onto map
var projection = d3.geo.mercator()
    .scale(1200 * 0.15)
    .translate([width / 2, height / 2]);

// define what each point-path will look like
var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the div for the tooltip
var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//--------------------------draw map------------------------------------------//

d3.json("data/world_places.json", function(error, world_places) {
  var subunits = topojson.feature(world_places, world_places.objects.subunits),
      places =   topojson.feature(world_places, world_places.objects.places);

  // add countries
  svg.selectAll(".subunit")
      .data(subunits.features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.id; })
      .attr("d", path)
      .on("mouseover", function(d,i){
                                    div.transition()
                                      .duration(200)
                                      .style("opacity", .9)
                                      .style("background", "orange");
                                    div
                                      .html(function(f) {return d.properties.ADMIN})
                                      .style("left", (d3.event.pageX) + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                                    })
      .on("mouseout", function(d,i){
                                    div.transition()
                                      .duration(500)
                                      .style("opacity", 0);
                                    });

  // add boundries
  svg.append("path")
    .datum(topojson.mesh(world_places, world_places.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
    .attr("d", path)
    .attr("class", "subunit-boundary");

  // add places
  svg.selectAll(".circle")
  		.data(places.features)
    .enter().append("circle")
  		.attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
  		.attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
  		.attr("r", "2px")
  		.attr("fill", "red")
      .on("mouseover", function(d,i){
                                    d3.select(this)
                                      .attr("fill", "orange")
                                      .attr("r", "4px");
                                    div.transition()
                                      .duration(0)
                                      .style("opacity", .9)
                                      .style("background", "lightsteelblue");
                                    div
                                      .html(function(f) {return d.properties.name + "<br>"
                                                                + "long: " + Math.round(d.geometry.coordinates[0]*100)/100 + "<br>"
                                                                + "lat: "  + Math.round(d.geometry.coordinates[1]*100)/100
                                                        })
                                      .style("left", (d3.event.pageX) + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                                    })
      .on("mouseout", function(d,i){
                                    d3.select(this)
                                      .attr("fill", "black")
                                      .attr("r", "2px");
                                    div.transition()
                                      .duration(500)
                                      .style("opacity", 0);
                                    });

  // add points outside your original dataset
  aa = [-41.160342, 28.180501, "titanic"]   // new long,lat, name
  bb = [-41.386129, 23.476145, "submarine"] // new long,lat, name

  svg.selectAll(".circle")
  		.data([aa,bb])           // define data as your new points
    .enter().append("circle")
  		.attr("cx", function (d) { return projection(d)[0]; })
  		.attr("cy", function (d) { return projection(d)[1]; })
  		.attr("r", "5px")
  		.attr("fill", "blue")
      .on("mouseover", function(d,i){
                                    d3.select(this)
                                      .attr("fill", "orange")
                                      .attr("r", "10px");
                                    div.transition()
                                      .duration(0)
                                      .style("opacity", .9)
                                      .style("background", "lightsteelblue");
                                    div
                                      .html(function(f) {return d[2] + "<br>"
                                                                + "long: " + Math.round(d[0]*100)/100 + "<br>"
                                                                + "lat: "  + Math.round(d[1]*100)/100
                                                        })
                                      .style("left", (d3.event.pageX) + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                                    })
      .on("mouseout", function(d,i){
                                    d3.select(this)
                                      .attr("fill", "black")
                                      .attr("r", "2px");
                                    div.transition()
                                      .duration(500)
                                      .style("opacity", 0);
                                    })

});
