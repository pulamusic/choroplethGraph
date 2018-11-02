var dataURL = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
var censusURL = "https://raw.githubusercontent.com/natrivera/2016_votes_by_county/master/2017_pop_estimate.csv";
var censusSet;
var dataSet;
var inter = 0;
var colors = [
  [5 , "#FFFFFF"] ,
  [10 , "#dbf0fd"] ,
  [15 , "#b7e1fc"] ,
  [20 , "#abdcfb"] ,
  [25 , "#93d2fa"] ,
  [30 , "#87cefa"] ,
  [35 , "#79b9e1"] ,
  [40 , "#6ca4c8"] ,
  [45 , "#5e90af"] ,
  [50 , "#517b96"] ,
  [55 , "#43677d"] ,
  ["56+" , "#365264"]
];
      //
      //Get THE DATA
      var req=new XMLHttpRequest();
      req.open("GET", dataURL ,true);
      req.send();
      req.onload=function(){
        dataSet = JSON.parse(req.responseText);

        req.open("GET", censusURL ,true);
        req.send();
        req.onload=function(){
          censusSet = csvJSON(req.responseText);
        };
        run();
      };
      //END OF GET THE DATA
      //

function run () {

  var path = d3.geoPath();

     var svg = d3.select(".map-div")
                .append("svg")
                .attr("width" , 960)
                .attr("height" , 600);

  var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .attr("id", "tooltip")
            .style("opacity", 0);


  //go into data and start building map
    d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
      if (error) throw error;

      //for each element in the data add a county
      svg.append("g")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
          .enter()
          .append("path")
          .attr("class", "counties")
          .attr("d", path)
          .attr("fill" , (d) => getColor(d.id))
          .attr("data-fips" , (d) => d.id)
          .attr("data-education" , (d) => getEdu(d.id))
          .on("mousemove" , (d) => {
              tooltip
                .attr("data-education" , getEdu(d.id))
                .style("opacity" , .9)
                .style("left" , getX(d3.event.pageX) + 0 + "px")
                .style("top" , d3.event.pageY - 105 + "px")
                .html(getText(d.id));
         })
          .on("mouseout" , (d) => {
             d3.select("#tooltip").style("opacity" , "0");
          });//end of adding counties


       //add a legend
  svg.append("g")
    .selectAll("rect")
    .attr("id" , "legend")
    .data(colors)
    .enter()
    .append("rect")
    .attr("class" , "legend-rect")
    .attr("height" , 15)
    .attr("width" , 35)
    .attr("x" , (d , i) =>  400 + (i * 38))
    .attr("y" , 30 )
    .attr("fill" , (d) => d[1]);

  svg.append("g")
    .selectAll("text")
    .attr("id" , "legend-text")
    .data(colors)
    .enter()
    .append("text")
    .attr("height" , 15)
    .attr("width" , 35)
    .attr("x" , (d , i) =>  405 + (i * 38))
    .attr("y" , 25 )
    .attr("fill" , "#000")
    .text((d) => d[0] + "%")
    .attr("font-size" , ".75em");

      //add county borders
      svg.append("path")
          .attr("class", "county-borders")
          .attr("d", path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; })));

  //add state borders
  svg.append("path")
          .attr("class", "state-borders")
          .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

    });//end of getJSON

}//end of run

function getX(num) {
  var ex = num;
  if(num > 700) {
    ex = num - 150;
  }
  return ex;
}

function getText(str) {
  var out = "";
  var pop = 0;
  str = parseInt(str);
  for(var i = 0; i < censusSet.length; i++) {
    if(str == censusSet[i].fips) {
      pop = censusSet[i].estimate2014;
      pop = parseInt(pop);
    }
  }
  pop = pop.toLocaleString();

  for(var i = 0; i < dataSet.length; i++) {
    if(str == dataSet[i].fips) {
      var bcs = dataSet[i].bachelorsOrHigher;
      out = dataSet[i].area_name +
        ", " + dataSet[i].state + "<br>" +
        "Pop: " + pop + "<br>" +
        "College: " + bcs + "%";
    }
  }
  return out;
}//

function getEdu(str) {
  var edu = "";

  for(var i = 0; i < dataSet.length; i++) {
    if(str == dataSet[i].fips) {
      edu = dataSet[i].bachelorsOrHigher;
    }
  }
  return edu;
}//end of getEdu

function getColor(str) {
  var color = "#79b9e1";
  for(var i = 0; i < dataSet.length; i++) {
    if(str == dataSet[i].fips) {
      var num = dataSet[i].bachelorsOrHigher;
      switch (true) {
        case (num < colors[0][0]):
            color = colors[0][1];
            break;
        case (num < colors[1][0]):
            color = colors[1][1];
            break;
        case (num < colors[2][0]):
            color = colors[2][1];
            break;
       case (num < colors[3][0]):
            color = colors[3][1];
            break;
       case (num < colors[4][0]):
            color = colors[4][1];
            break;
       case (num < colors[5][0]):
            color = colors[5][1];
            break;
       case (num < colors[6][0]):
            color = colors[6][1];
            break;
       case (num < colors[7][0]):
            color = colors[7][1];
            break;
       case (num < colors[8][0]):
            color = colors[8][1];
            break;
       case (num < colors[9][0]):
            color = colors[9][1];
            break;
       case (num < colors[10][0]):
            color = colors[10][1];
            break;
            color = colors[11][1];
            break;
      }//end of switch
    }//end of if id == fips
  }//end of for loop

  return color;
}

//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);

  }

  //return result; //JavaScript object
  return result; //JSON
}
