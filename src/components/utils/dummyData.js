import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "whatwg-fetch";

const randomAroundMean = (mean, deviation) => mean + boxMullerRandom() * deviation
const boxMullerRandom = () => (
  Math.sqrt(-2.0 * Math.log(Math.random())) *
  Math.cos(2.0 * Math.PI * Math.random())
)

const today = new Date()
const formatDate = d3.timeFormat("%m/%d/%Y")

export const getTimelineData = (length = 100) => {
  let lastTemperature = randomAroundMean(70, 20)
  const firstTemperature = d3.timeDay.offset(today, -length)

  return new Array(length).fill(0).map((d, i) => {
    lastTemperature += randomAroundMean(0, 2)
    return {
      date: formatDate(d3.timeDay.offset(firstTemperature, i)),
      temperature: lastTemperature,
    }
  })
}

export const getScatterData = (count = 100) => (
  new Array(count).fill(0).map((d, i) => ({
    temperature: randomAroundMean(70, 20),
    humidity: randomAroundMean(0.5, 0.1),
  }))
)

export const getIntraTimeBarData = () => {

  const [data, setData] = useState()
  
  React.useEffect(() => {
    async function getData() {
      const response = await fetch('/swr-timeline-top25-overall-per-year.csv')
      const reader = response.body.getReader()
      const result = await reader.read() // raw array
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) // the csv text
      const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
      const data = results.data // array of objects
      setData(data)
    }
    getData()
  }, [])
  
  return (data);

  // const URL = '/swr-timeline-top25-overall-per-year.csv';

  // let data = d3.csv(URL, (d) => {
  //     return {
  //       cited_name: d.cited_name,
  //       cited_total: d.cited_total,
  //       citing_year: d.citing_year
  //     }
  //   }).then((data) => {
  //       return data.map(Object.values)
  //   });

  // return data;

  
  // return d3.csv(URL, function(d) {
  //   return {
  //     cited_name: d.cited_name,
  //     cited_total: d.cited_total,
  //     citing_year: d.citing_year
  //   }
  // }).then(function(data) {
  //   return data;
  // });

}