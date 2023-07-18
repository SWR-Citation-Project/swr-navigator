import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as d3c from "d3-collection";

const parseDate = d3.timeParse("%m/%d/%Y")
// const xAccessor = (d) => parseDate(d.date);
// const yAccessor = (d) => d.citing_total;

const IntraChart = (d) => {

  // const [readyData, setData] = useState()
  const data = {}

  // Element References
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const svgContainer = useRef(null) // The PARENT of the SVG

  // State to track width and height of SVG Container
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()

  // Calculate width and height of the container
  const getSvgContainerSize = () => {
    const newWidth = svgContainer.current.clientWidth;
    setWidth(newWidth);

    const newHeight = svgContainer.current.clientHeight;
    setHeight(newHeight);
  }
  // Resize event listener
  useEffect(() => {
    // detect 'width' and 'height' on render
    getSvgContainerSize();
    // listen for resize changes, and detect dimensions again when they change
    window.addEventListener("resize", getSvgContainerSize);
    // cleanup event listener
    return () => window.removeEventListener("resize", getSvgContainerSize);
  }, [])

  // Set data when ready
  const setReadyData = async (d) => {
    if (d.d.length > 0) {
      const parsedData = []
      const dataToParse = d.d
      dataToParse.forEach((row) => {
        parsedData.push({
          cited_name: row.cited_name,
          citing_year: parseDate(row.citing_year),
          cited_total: row.cited_total
        })
      })
      return parsedData
    }
  }

  // Draw D3 Chart
  useEffect(() => {
    const prepData = async () => {
      const dd = await setReadyData(d)
      return dd
    }
    const drawIntraChart = async () => {
      const theData = await prepData(d)
      
      // If data returned, draw chart
      if (theData != null) {
        
        // Assign data
        data.full = theData
        data.years = _years(data.full)
        data.types = _types(data.full)
        
        // Constants and parsers
        const margin = {top: 100, right: 10, bottom: 50, left: 125}
        const rowHeight = 12,
              topBarWidth = 20,
              rowPadding = 8,
              textOffset = 1,
              textOffsetX = 35;

        const types = d3c.nest().key(d => d.cited_name)
          .rollup(scholars => ({
            total: d3.sum(scholars, s => s.cited_total),
            scale: d3.scaleSqrt()
              .domain([0, d3.max(scholars, s => s.cited_total)])
              .range([0, rowHeight / 2]),
            count: scholars.length
          }))
          .object(data.full)
        const typeEntries = d3c.entries(types)
        const numTypes = d3c.keys(types).length

        let dimensions = {
          width: width, // width from state
          height: height, // height from state
          margins: 50,
        }
        dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
        dimensions.containerHeight = dimensions.height - dimensions.margins * 2;
        
        const x = _x(data.full, (dimensions.containerWidth))
        const x2 = _x2(typeEntries, x, (dimensions.containerWidth/1.15))
        
        const y = _y(types, numTypes, rowHeight, rowPadding)
        // const y2 = _y2(data.years, rowHeight)
        
        const xAxis = g => {
          return (
            g.attr("transform", `translate(0, ${numTypes * (rowHeight + rowPadding) + rowHeight})`)
              .call(
                d3.axisBottom(x)
                  .ticks(d3.timeYear, (dimensions.width) / 100)
                  .tickFormat(d3.timeFormat("%Y"))
              )
              .call(g => g.select(".domain").remove())
          )
        }

        // Selections
        const svg = d3
          .select(svgRef.current)
          .classed("intratimebar__svg", true)
          .attr("width", dimensions.width)
          .attr("height", dimensions.height);

        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        const container = svg
          .append("g")
          .classed("container", true)
          .attr("width", dimensions.width)
          .attr("height", dimensions.height)
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Tooltip container
        // const tooltip = d3.select(tooltipRef.current);
        // const tooltipDot = container
        //   .append("circle")
        //   .classed("tool-tip-dot", true)
        //   .attr("r", 5)
        //   .attr("fill", "#fc8781")
        //   .attr("stroke", "black")
        //   .attr("stroke-width", 2)
        //   .style("opacity", 0)
        //   .style("pointer-events", "none");

        // Top bars for each year
        container.append("g")
          .selectAll("rect")
          .data(data.years)
          .enter().append("rect")
          .attr("x", d => x(d.key) - 15)
          .attr("y", d => (-d.value/3))
          .attr("height", d => (d.value/3))
          .attr("width", d => x(d3.timeMonth.offset(d.key, 1)) - x(d.key) + topBarWidth)
          .attr("fill", "firebrick")
          .attr("opacity", 0.25)

        container.append("g")
          .call(xAxis)
        
        const typeRows = container.append("g")
          .selectAll("g")
          .data(d3c.entries(types))
          .enter().append("g")

        // Row labels, lines, rightside bar
        typeRows.append("text")
          .text(d => `${d.key} (${d.value.count})`)
          .attr("class", "label")
          .attr("x", -margin.left + textOffsetX)
          // .attr("x", -dimensions.margins + textOffsetX)
          .attr("y", d => y(d.key) + textOffset)

        typeRows.append("line")
          .attr("x1", x.range()[0])
          .attr("x2", x.range()[1])
          .attr("stroke", "rgba(0,0,0,0.05)")
          .attr("y1", d => y(d.key))
          .attr("y2", d => y(d.key))

        typeRows.append("rect")
          .attr("x", (x2.range()[0]))
          .attr("y", d => y(d.key) - rowHeight / 2)
          .attr("height", rowHeight)
          .attr("width", d => x2(d.value.total) - (x2.range()[0]))
          .attr("fill", "firebrick")
          .attr("opacity", 0.25)

        typeRows.append("text")
          .text(d => d.value.total)
          .attr("class", "label")
          .attr("text-anchor", "end")
          .attr("x", x2.range()[1] + 1)
          .attr("y", d => y(d.key)+4)

        // Chart circles per year
        container.append("g")
          .selectAll("circle")
          .data(data.full)
          .enter().append("circle")
          .attr("cx", function(d){
            return x(d.citing_year) 
          })
          .attr("cy", d => y(d.cited_name))
          .attr("r", d => types[d.cited_name].scale(d.cited_total))
          .attr("fill", "firebrick")
          .attr("opacity", 0.25)

        // Tooltip Event Handling
        // container
        //   .append("rect")
        //   .classed("mouse-tracker", true)
        //   .attr("width", dimensions.containerWidth)
        //   .attr("height", dimensions.containerHeight)
        //   .style("opacity", 0)
        //   .on("touchmouse mousemove", function (event) {
        //     const mousePos = d3.pointer(event, this);

        //     // x coordinate stored in mousePos index 0
        //     const date = x2.invert(mousePos[0]);

        //     // Custom Bisector - left, center, right
        //     const dateBisector = d3.bisector(xAccessor).center;

        //     const bisectionIndex = dateBisector(data.full, date);
        //     //console.log(bisectionIndex);
        //     // math.max prevents negative index reference error
        //     const hoveredIndexData = data.full[Math.max(0, bisectionIndex)];

        //     // Update Image
        //     tooltipDot
        //       .style("opacity", 1)
        //       .attr("cx", x2(xAccessor(hoveredIndexData)))
        //       .attr("cy", y2(yAccessor(hoveredIndexData)))
        //       .raise();

        //     tooltip
        //       .style("display", "block")
        //       .style("top", `${y2(yAccessor(hoveredIndexData)) - 50}px`)
        //       .style("left", `${x2(xAccessor(hoveredIndexData))}px`);

        //     tooltip.select(".data").text(`${yAccessor(hoveredIndexData)}`);

        //     const dateFormatter = d3.timeFormat("%B %-d, %Y");

        //     tooltip.select(".date").text(`${dateFormatter(xAccessor(hoveredIndexData))}`);
        //   })
        //   .on("mouseleave", function () {
        //     tooltipDot.style("opacity", 0);
        //     tooltip.style("display", "none");
        //   });
      }
    }
    drawIntraChart()
  }, [d, data.full, data.types, data.years, width, height]) // redraw chart if data or dimensions change

  return (
    <div ref={svgContainer} className="intrachart_responsive_container">
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="lc-tooltip">
        <div className="data"></div>
        <div className="date"></div>
      </div>
    </div>
  );
}

export default IntraChart;

// FUNCTIONS
function _years(data){
  return(
    d3c.nest()
      .key(d => {
        return d3.timeMonth.floor( d.citing_year )
      })
      .sortKeys((a, b) => (new Date(a) - new Date(b)))
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
          total: d3.sum(scholars, s => s.cited_total),
          scale: d3.scaleSqrt()
            .domain([0, d3.max(scholars, s => s.cited_total)])
            .range([0, rowHeight / 2]),
          count: scholars.length
        }))
      .object(data)
)}

function _x(data, innerWidth){
  return(
    d3.scaleTime()
      .domain([
        d3.timeYear.floor(d3.min(data, d => d.citing_year)), 
        d3.timeYear.ceil(d3.max(data, d => d.citing_year))
      ])
      .range([50, innerWidth - 200])
)}

function _x2(typeEntries, x, innerWidth){
  return(
    d3.scaleLinear()
      .domain([0, d3.max(typeEntries, d => {
        return d.value.total
      })])
      .range([x.range()[1] + 16, innerWidth])
)}

function _y(types,numTypes,rowHeight,rowPadding){
  return(
    d3.scaleOrdinal()
      .domain(d3c.entries(types).sort((a,b) => {
        return b.value.total - a.value.total
    }).map(t => t.key))
      .range(d3.range(numTypes).map(d => (d * (rowHeight + rowPadding)) + rowHeight))
)}

