import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"
// import * as d3 from "d3"
import {json} from "d3"

import "./assets/css/styles.css";
import { accessorPropsType } from "./Chart/utils"
import IntraChart from "./Chart/IntraChart"

// const parseDate = d3.timeParse("%m/%d/%Y")

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [intraData, SetIntraRows] = useState([]);

  useEffect(() => {
    setLoading(true)

    // const fetchIntraData = fetch("/data/swr-timeline-top25-overall-per-year.json")
    //   .then((response) => {
    //     return response.json()
    //   })
    //   .then((data) => {
    //     return data
    //   })

    const getIntraData = async () => {
      json("/data/swr-timeline-top25-overall-per-year.json")
      .then((d) => {
        setLoading(false)
        SetIntraRows(d)
      })
      // const d = await fetchIntraData
      // setLoading(false)
      // SetIntraRows(d)
    }
    getIntraData()
  }, [])

  return (
    <div className="App home__dashboard_container">
      <main className="App__charts">
        <article id="intra_time_bar" className="intratimebar__container">
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
