import * as d3 from "d3";
import {csv} from "d3";
import * as d3c from "d3-collection";

export async function getIntraTimeBarData() {
  
  const parseDate = d3.timeParse("%m/%d/%Y")
  let innerWidth = 1130,
      rowHeight = 12,
      rowPadding = 5,
      textOffset = -10,
      textOffsetX = 5;

  return new Promise((resolve) => {
    let allData = {};

    let data = csv(require("./../data/swr-timeline-top25-overall-per-year.csv"), (row) => {
      return {
        cited_name: row.cited_name,
        citing_year: parseDate(row.citing_year),
        cited_total: +row.cited_total,
      }
    })
    // Write Full
    .then((data) => {
      allData.full = data
      return allData
    })
    .then((allData) => {
      allData.years = _years(allData.full)
      return allData
    })
    .then((allData) => {
      allData.types = _types(allData.full)
    })
    resolve(allData)
  })
}

// FUNCTIONS
function _years(data){
  return(
    d3c.nest()
      .key(d => d3.timeMonth.floor(d.citing_year)).sortKeys((a, b) => (new Date(a) - new Date(b)))
      .rollup(scholars => d3.sum(scholars, s => s.cited_total))
      .entries(data).map(m => ({
          value: m.value,
            key: new Date(m.key)
        }))
)}

function _types(data, rowHeight){
  return(
    d3c.nest()
      .key(d => d.cited_name )
      .rollup(scholars => ({
          // total: cited_total_range(scholars),
          total: d3.sum(scholars, s => s.cited_total),
          scale: d3.scaleSqrt()
            .domain([0, d3.max(scholars, s => s.cited_total)])
            .range([0, rowHeight / 2]),
          count: scholars.length
        }))
      .object(data)
)}

function _typeEntries(types){
  return(Object.entries(types))
}

