
//URLS FOR OUR DATA
var EDUCATION_URL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';

var COUNTY_URL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

//SETUP SVG DIMENSIONS
var margin = { top: 0, left:0, right:0, bottom:0};
var height = 600 - margin.top - margin.bottom;
var width = 960 - margin.left - margin.right;

//DEFINE BODY
var body = d3.select("body");
//BUILD INITIAL SVG
var svg = d3.select("#map")
        .append("svg")
        .attr('height', height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right);

//GET JSON
d3.queue()
.defer(d3.json, COUNTY_URL)
.defer(d3.json, EDUCATION_URL)
.await(ready);

//SET UP OUR MAP PROJECTION
var projection = d3.geoAlbersUsa()
.translate([width/2,height/2])
.scale(100);

//DEFINE OUR PATH
var path = d3.geoPath();

//GET DATA OR THROW ERROR
function ready(error, data1, dataEd) {
  if (error) throw error;

  //ISOLATE BACHELORS DEGREE %s
var bachelorDegP = dataEd.map(function(obj){
    return obj.bachelorsOrHigher;
  });
var bDPMin = d3.min(bachelorDegP);
var bDPMax = d3.max(bachelorDegP);

  console.log(bachelorDegP);

 //DEFINE COUNTIES FROM DATA
  var counties = topojson.feature(data1,data1.objects.counties).features;

  //BUILD INITIAL TOOLTIP
var tooltip = body.append("div")
                  .attr("class","tooltip")
                  .attr("id","tooltip")
                  .attr("data-education", 22,1)
                  .style("opacity",0);


  //BUILD OUR MAP
   svg.append("g")
  .attr('class','counties')
  .selectAll('path')
  .data(counties)
  .enter()
  .append('path')
  .attr('class','county')
  .attr('d',path)
  .attr("data-fips",function(d){return d.id;})
  .attr('data-education',function(d){
    var result = dataEd.filter(function(obj){
     return obj.fips == d.id;});
     return result[0].bachelorsOrHigher;})
  .attr("fill",function(d){
    var result = dataEd.filter(function(obj){
      return obj.fips ==d.id;});
      if(result[0].bachelorsOrHigher > 50){
        return 'rgb(20, 172, 255)';}
      else if(result[0].bachelorsOrHigher> 40){return 'rgba(20, 172, 255, 0.9)';}
      else if(result[0].bachelorsOrHigher> 35){return 'rgba(20, 172, 255, 0.8)';}
      else if(result[0].bachelorsOrHigher> 30){return 'rgba(20, 172, 255, 0.7)';}
      else if(result[0].bachelorsOrHigher> 25){return 'rgba(20, 172, 255, 0.6)';}
      else if(result[0].bachelorsOrHigher> 20){return 'rgba(20, 172, 255, 0.5)';}
      else if(result[0].bachelorsOrHigher> 15){return 'rgba(20, 172, 255, 0.4)';}
      else if(result[0].bachelorsOrHigher> 10){return 'rgba(20, 172, 255, 0.3)';}
     else if(result[0].bachelorsOrHigher> 5){return 'rgba(20, 172, 255, 0.2)';}
     else if(result[0].bachelorsOrHigher> 0){return 'rgba(20, 172, 255, 0.1)';}})
  .on("mouseover",function(d){
     tooltip.style("opacity",.9)
     tooltip.html(function(){
       var result = dataEd.filter(function(obj){
         return obj.fips == d.id;
       });
     if(result[0]){return result[0]['area_name'] + ', ' + result[0]['state'] + '<br>' + result[0].bachelorsOrHigher + '%';}})
     .style("left", d3.event.pageX + 40 + 'px')
     .style('top', d3.event.pageY - 30 + 'px');})
  .on("mouseout",function(d){
     tooltip.style('opacity',0);});


  //DEFINE STATE LINES FROM DATA
  var states = topojson.feature(data1, data1.objects.states).features;


  svg.append("g")
  .attr("class", "states")
  .selectAll("path")
  .data(states)
  .enter()
  .append("path")
  .attr("class",'state')
  .attr("d",path);


var title = svg.append("text")
          .attr("x",600)
          .attr("y",40)
          .attr("text-anchor","middle")
          .attr("id","title")
          .style("font-size","30px")
          .style("font-weight", "bold")
          .text("US Bachelor's Degree Frequency: % By County");

var description = svg.append("text")
                     .attr("x",450)
                     .attr("y",598)
                     .attr("text-anchor","middle")
                     .attr("id","description")
                     .style("font-size","14px")
                     .text("*Hover your mouse over any county in America to see the percentage of adults that have a bachelor's degree");


//ATTEMPT VERTICAL LEGEND
  var keyData = [{'val':0,"col":'rgba(20, 172, 255, 0.1)'},
                 {'val':5,"col":'rgba(20, 172, 255, 0.2)'},
                 {'val':10,"col":'rgba(20, 172, 255, 0.3)'},
                 {'val':15,"col":'rgba(20, 172, 255, 0.4)'},
                 {'val':20,"col":'rgba(20, 172, 255, 0.5)'},
                 {'val':25,"col":'rgba(20, 172, 255, 0.6)'},
                 {'val':30,"col":'rgba(20, 172, 255, 0.7)'},
                 {'val':35,"col":'rgba(20, 172, 255, 0.8)'},
                 {'val':40,"col":'rgba(20, 172, 255, 0.9)'},
                 {'val':50,"col":'rgb(20, 172, 255'}];

var g = svg.append('g')
.attr("class",'key')
.attr('id','legend')
.attr("transform",'translate(880,300)');

  g.selectAll("rect")
  .data(keyData)
  .enter()
  .append("rect")
  .attr('height',20)
  .attr("y",function(d,i){return i*20;})
  .attr("width", 30)
  .attr("fill",function(d){return d.col;});

var y = d3.scaleLinear()
.range([200,0])
.domain([50,0]);

  svg.append('g')
  .attr('class','axis')
  .attr("transform",'translate(905,300)')
  .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d +'%';}));
}
