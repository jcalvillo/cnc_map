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
    height = 1160;

// create a function that will scale+project onto map
var projection = d3.geo.mercator()
    .scale(1200 * 0.15)
    .translate([width / 2, height / 2]);

// define what each point-path will look like
var path = d3.geo.path()
    .projection(projection)
    // .pointRadius(2)
    ;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the div for the tooltip
var div = d3.select("body").append("div")
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
      .attr("d", path);

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
                                      .duration(200)
                                      .style("opacity", .9);
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
                                    })
      ;


  // // place labels
  // svg.selectAll(".place-label")
  //     .data(places.features)
  //   .enter().append("text")
  //     .attr("class", "place-label")
  //     .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
  //     .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
  //     .attr("dy", ".35em")
  //     .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
  //     .text(function(d) { return d.properties.name; });

});
