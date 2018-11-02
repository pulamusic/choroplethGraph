/*
This is a freeCodeCamp data visualization project created by Jim Carroll (https://github.com/pulamusic). Please feel free to fork this code for use in your own projects. No rights reserved.
*/

// *********************GLOBAL VARIABLES********************

// data urls
const educUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
const countyUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
const mapUrl = "https://d3js.org/us-10m.v1.json"

// map colors from colorbrewer2.org
const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']

// const mapScale = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, "56+"]

const legendArr = [
  [5, colors[0]],
  [10, colors[1]],
  [15, colors[2]],
  [20, colors[3]],
  [25, colors[4]],
  [30, colors[5]],
  [35, colors[6]],
  [40, colors[7]],
  [45, colors[8]],
  [50, colors[9]],
  [55, colors[10]],
  ["56+", colors[11]],

]

// const margin = {
//   top: 5,
//   bottom: 80,
//   left: 120,
//   right: 40
// }
//
// const width = 1200 - margin.left - margin.right
// const height = 700 - margin.top - margin.bottom

let countySet

// *********************DATA REQUEST********************

const req = new XMLHttpRequest()
req.open("GET", educUrl, true)
req.send()
req.onload = () => {
  dataSet = JSON.parse(req.responseText)

  req.open("GET", countyUrl, true)
  req.send()
  req.onload = () => {
    countySet = csvJSON(req.responseText)
  }
  run()
}

// ********************RUN FUNCTION*********************

const run = () => {

  const path = d3.geoPath()

  const svg = d3.select(".map-div")
    .append("svg")
    .attr("width", 960)
    .attr("height", 600)

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .attr("opacity", 0)

  // JSON info to begin building map
  // NOTE: This part of the code adapted from https://gist.github.com/mbostock/4090848
  d3.json(mapUrl, (error, us) => {
    if (error) throw error

    // add counties to map
    svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("path")
      .attr("class", "counties")
      .attr("d", path)
      .attr("fill", (d) => getColor(d.id))
      .attr("data-fips", (d) => d.id)
      .attr("data-education", (d) => getEdu(d.id))
      // tooltip on mouseover
      .on("mouseover", (d) => {
        tooltip.attr("data-education", getEdu(d.id))
          .attr("opacity", 0.9)
          .style("left", getX(d3.event.pageX) + 0 + "px")
          .style("top", d3.event.pageY - 105 + "px")
          .html(getText(d.id))
      })
      // tooltip mouseout
      .on("mouseout", (d) => {
        d3.select("#tooltip")
          .attr("opacity", 0)
      })

    // map legend
    svg.append("g")
      .selectAll("rect")
      .attr("id", "legend")
      .data(legendArr)
      .enter()
      .append("rect")
      .attr("class", "legend-rect")
      .attr("height", 15)
      .attr("width", 35)
      .attr("x", (d, i) => 400 + (i * 38))
      .attr("y", 30)
      .attr("fill", (d) => d[1])

    // legend text
    svg.append("g")
      .selectAll("text")
      .attr("id", "legend-text")
      .data(legendArr)
      .enter()
      .append("text")
      .attr("height", 15)
      .attr("width", 35)
      .attr("x", (d, i) => 405 + (i * 38))
      .attr("y", 25)
      .attr("fill", "#000000")
      .text((d) => d[0] + "%")
      .style("font-size", "0.7em")

    // add county borders
    svg.append("path")
      .attr("class", "county-borders")
      .attr("d", path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b)))

    // add state borders
    svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)))

  }) // end of JSON call

} // end of run function

// ***************HELPER FUNCTIONS****************

// set X attribute for tooltips
const getX = (num) => {
  let ex = num
  if (num > 700) {
    ex = num - 150
  }
  return ex
} // end of getX

// text for tooltips
const getText = (str) => {
  let out = ""
  let pop = 0
  str = parseInt(str)

  for (let i = 0; i < countySet.length; i++) {
    if (str == countySet[i].fips) {
      pop = countySet[i].estimate2014
      pop = parseInt(pop)
    }
  }
  pop = pop.toLocaleString()

  for (let i = 0; i < dataSet.length; i++) {
    if (str == dataSet[i].fips) {
      let bcs = dataSet[i].bachelorsOrHigher
      out = dataSet[i].area_name + ", " + dataSet[i].state + "<br>Population: " + pop + "<br>College: " + bcs + "%"
    }
  }
  return out
} // end of getText

// get educ data
const getEdu = (str) => {
  let edu = ""
  for (let i = 0; i < dataSet.length; i++) {
    if (str == dataSet[i].fips) {
      edu = dataSet[i].bachelorsOrHigher
    }
  }
  return edu
} // end of getEdu

// determine colors for map using data from legendArr
const getColor = (str) => {
  let color = "#eae3d3"
  for (let i = 0; i < dataSet.length; i++) {
    if (str == dataSet[i].fips) {
      let num = dataSet[i].bachelorsOrHigher

      switch (true) {
        case (num < legendArr[0][0]):
          color = colors[0]
          break
        case (num < legendArr[1][0]):
          color = colors[1]
          break
        case (num < legendArr[2][0]):
          color = colors[2]
          break
        case (num < legendArr[3][0]):
          color = colors[3]
          break
        case (num < legendArr[4][0]):
          color = colors[4]
          break
        case (num < legendArr[5][0]):
          color = colors[5]
          break
        case (num < legendArr[6][0]):
          color = colors[6]
          break
        case (num < legendArr[7][0]):
          color = colors[7]
          break
        case (num < legendArr[8][0]):
          color = colors[8]
          break
        case (num < legendArr[9][0]):
          color = colors[9]
          break
        case (num < legendArr[10][0]):
          color = colors[10]
          break
        default:
          color = colors[11]

      }
    }
  }
  return color
}

// CSV for JSON call on counties
const csvJSON = (csv) => {
  let lines = csv.split("\n")
  let result = []
  let headers = lines[0].split(",")

  for (let i = 1; i < lines.length; i++) {
    let obj = {}
    let currentLine = lines[i].split(",")

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j]
    }
    result.push(obj)
  }
  return result
}
