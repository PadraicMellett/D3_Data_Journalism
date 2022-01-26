// D3 Graph

// Section 1: Data Set Up

// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Graph Height
var height = width - width / 4.2;

// Graph Spacing
var margin = 23;

// Placements
var labelArea = 125;

// Padding
var tPadBot = 38;
var tPadLeft = 38;

// Graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Graph Radius

var circRadius;
function crGet() {
  if (width <= 540) {
    circRadius = 11;
  }
  else {
    circRadius = 12;
  }
}
crGet();

// Labels

// X-Axis


svg.append("g").attr("class", "xText");

var xText = d3.select(".xText");

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();


// Poverty 
xText
  .append("text")
  .attr("y", -28)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Poverty Stats (%)");
// Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Median - Age");
// Income
xText
  .append("text")
  .attr("y", 28)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Median - Household Earnings");

// B) Y Axis

var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Text

// Obesity
yText
  .append("text")
  .attr("y", -29)
  .attr("data-name", "Obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obesity - %");

// Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "Smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smoking - %");

// Lacks Healthcare
yText
  .append("text")
  .attr("y", 27)
  .attr("data-name", "Healthcare Access")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Healthcare Access - %");

// Import Data

// CSV
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  visualize(data);
});

// Visualization function

function visualize(theData) {

  // Variables & Functions
 
  var curX = "poverty";
  var curY = "obesity";

  var xMin;
  var xMax;
  var yMin;
  var yMax;

  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([42, -62])
    .html(function(d) {
      
      var theX;
      // State Name.
      var theState = "<div>" + d.state + "</div>";
    
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
   
      if (curX === "poverty") {
        
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
       
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }

      return theState + theX + theY;
    });

  svg.call(toolTip);

  // Further Functions

  // Change the min and max for x
  function xMinMax() {
  
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // Change the min and max for y
  function yMinMax() {
    
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // Change Class & Appearance when activated
  function labelChange(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  // Scatter Plot

  // First grab the min and max values of x and y.
  xMinMax();
  yMinMax();

  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height
    .range([height - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Determine x and y counts

  function tickCount() {
    if (width <= 550) {
      xAxis.ticks(5.5);
      yAxis.ticks(5.5);
    }
    else {
      xAxis.ticks(10.50);
      yAxis.ticks(10.5);
    }
  }
  tickCount();

  // We append the axes in group elements. By calling them, we include

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Grouping
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      // Circle border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // Match labels with circles
 
  theCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]) + circRadius / 3.0;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    .on("mouseover", function(d) {
      toolTip.show(d);
      // Circle Border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // Dynamic Graph

  d3.selectAll(".aText").on("click", function() {

    var self = d3.select(this);

    if (self.classed("inactive")) {
     
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      if (axis === "x") {
    
        curX = name;

        xMinMax();

        // Update X
        xScale.domain([xMin, xMax]);

        svg.select(".xAxis").transition().duration(310).call(xAxis);

        // Update Circle Placement
        d3.selectAll("circle").each(function() {
          
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(310);
        });

        // Text location change
        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(310);
        });

        labelChange(axis, self);
      }
      else {
      
        curY = name;

        // Change Y-axis min and max
        yMinMax();

        // Update Y domain
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(310).call(yAxis);

        // Update Circles
        d3.selectAll("circle").each(function() {
          // Transition
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(310);
        });

        d3.selectAll(".stateText").each(function() {
          // Circles Motion
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(310);
        });

        // Label
        labelChange(axis, self);
      }
    }
  });

  // Responsivness
  d3.select(window).on("resize", resize);

  function resize() {
   
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // Width & Height Adjustment
    svg.attr("width", width).attr("height", height);

    // Change scale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // Axes Update
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // Tick Count
    tickCount();

    // Labels
    xTextRefresh();
    yTextRefresh();

    // Update Dot Radius
    crGet();

    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    // Text Location
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}
