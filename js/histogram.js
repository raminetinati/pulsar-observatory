var svg;

 var data = []

function drawHisto(){
    var margin = {top: 40, right: 50, bottom: 30, left: 80},
    width = 300 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
    var formatPercent = d3.format("");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

    var svg = d3.select("#kmlHistoDiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    langDist = {};
    data = [];
    for(lang in langDist){

        data.push({letter: lang, frequency: langDist[lang]})

    }

   

    // The following code was contained in the callback function.
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })

    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }

}

function updateHistoData(langDist){
    // Generate a log-normal distribution with a median of 30 minutes
    var myNode = document.getElementById("kmlHistoDiv");
    while (myNode.firstChild) {
         myNode.removeChild(myNode.firstChild);
    }
   
var margin = {top: 40, right: 50, bottom: 30, left: 80},
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

 var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient("left");
       // .tickFormat(formatPercent);

    var svg = d3.select("#kmlHistoDiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    data = [];
    for(lang in langDist){

        data.push({letter: lang, frequency: langDist[lang]})

    }

   

    // The following code was contained in the callback function.
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .text("Tweet Language")
        .attr("x",150)
        .attr("y",50);

 
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "translate(30,0)")
        .attr("transform", "rotate(-90)")
        .attr("y",-60)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })

    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }







}