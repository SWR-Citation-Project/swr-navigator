import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types"
import * as d3 from "d3";

import "./assets/css/styles.css";
import { useChartDimensions, accessorPropsType, useUniqueId } from "./Chart/utils"
import IntraChart from "./Chart/IntraChart"

const parseDate = d3.timeParse("%m/%d/%Y")
const dateAccessor = d => parseDate(d.citing_year)
const nameAccessor = d => d.citing_name
const citingTotalAccessor = d => d.citing_total

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [intraData, SetIntraRows] = useState([]);
  const [ref, dimensions] = useChartDimensions();

  useEffect(() => {
    setLoading(true)

    const fetchIntraData = fetch("/data/swr-timeline-top25-overall-per-year.json")
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        return data
      })

    const getIntraData = async () => {
      const d = await fetchIntraData
      setLoading(false)
      SetIntraRows(d)
    }
    getIntraData()
  }, [])

  return (
    <div className="App home__dashboard_container">
      <main className="App__charts">
        <article id="intra_time_bar" className="intratimebar__container" ref={ref}>
        {
          loading ? (
            <>
            <div className="loading__container">
              <img alt="" src="/images/loading_icon.gif" />
              <p>Loading...</p>
            </div>
            </>
          ) : (
            <IntraChart d={intraData}>
            </IntraChart>
          )
        }
        </article>
      </main>
    </div>
  );
}

Home.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string,
}

Home.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
