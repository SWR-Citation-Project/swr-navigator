import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./Chart/Chart"
import Line from "./Chart/Line"
import Axis from "./Chart/Axis"
import Gradient from "./Chart/Gradient";
import { useChartDimensions, accessorPropsType, useUniqueId } from "./Chart/utils"

const createIntraChart = (data) => {

  let innerWidth = 5,
  margin = 0,
  numTypes = 0,
  rowHeight = 0,
  rowPadding = 0,
  years = data,
  x,
  y2,
  xAxis,
  types,
  textOffsetX,
  y,
  textOffset,
  x2;

  // NEW
  const svg = d3.select(".intratimebar__container").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // let chart = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)


  // ORIGINAL

  // const margin = { top: 20, right: 20, bottom: 50, left: 70 },
  //   width = 960 - margin.left - margin.right,
  //   height = 500 - margin.top - margin.bottom;
  // const x = d3.scaleTime().range([0, width]);
  // const y = d3.scaleLinear().range([height, 0]);

  // const valueLine = d3.line()
  //   .x((d) => { return x(d.citing_year); })
  //   .y((d) => { return y(d.citing_total); });

  // const svg = d3.select(".app__container").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // x.domain(d3.extent(data, (d) => { return d.citing_year; }));
  // y.domain([0, d3.max(data, (d) => { return d.citing_total; })]);

  // svg.append("path")
  //   .data([data])
  //   .attr("class", "line")
  //   .attr("d", valueLine);

  // svg.append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(d3.axisBottom(x));

  // svg.append("g")
  //   .call(d3.axisLeft(y));
}

const IntraTimeBar = ({ data, xAccessor, yAccessor, nameAccessor }) => {

  const [ref, dimensions] = useChartDimensions()
  // const [data, setData] = useState([]);

  useEffect(() => {
    // const createIntraChart = async () => {
    //   setLoading(true);
    //   getIntraTimeBarData()
    //     .then(d => {
    //       SetIntraRows(d)
    //       setLoading(false);
    //     })
    // }
    createIntraChart(data, xAccessor, yAccessor, nameAccessor);
  }, [])

  // useEffect(() => {
  //   setData(intraData)
  // }, [])
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const y0AccessorScaled = yScale(yScale.domain()[0])

  return (
    <article className="intratimebar__container" ref={ref}>
      <Chart
        dimensions={dimensions}
        className="intratimebar__chart_wrapper"
      >
        
      </Chart>
    </article>
  )
}

IntraTimeBar.propTypes = {
    xAccessor: accessorPropsType,
    yAccessor: accessorPropsType,
    label: PropTypes.string,
}

IntraTimeBar.defaultProps = {
    xAccessor: d => d.x,
    yAccessor: d => d.y,
}

export default IntraTimeBar
