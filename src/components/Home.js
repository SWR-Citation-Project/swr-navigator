import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"
import axios from "axios"

// import "./assets/css/styles.css";
import { accessorPropsType } from "./Chart/utils"
import IntraChart from "./Chart/IntraChart"

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [intraData, SetIntraRows] = useState([]);

  useEffect(() => {
    setLoading(true)

    const fetchIntraData = axios
      .get("/swr-timeline-top25-overall-per-year.json",
        {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
      })
      .then((res) => {
        return res.data
      })
      .catch(err=>console.log(err))

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
        <article id="intra_time_bar" className="intratimebar__container">
          <header className="intratimebar__explainers">
            <h2>Citation Timeline for Overall Top 25 Cited Scholars: 2012-2019</h2>
            <p>
              Top 25 computed from original n=65640 sample.
            </p>
            <p>
              Each cited scholar corresponds to a row on the timeline. The rows are ordered by total citation amount received for that scholar between 2012 - 2019. The citation total for each author is shown on the right-hand side of the chart.
            </p>
            <p>
              Yearly citation counts for each scholar are shown as bubbles on their corresponding row. The bubbles are sized proportionally to their value, relative to the maximimum amount for that scholar. That is, all of Royster's citations are sized relative to their largest Royster amount of citations received, and all of Brandt's citations are sized relative to their largest Brandt amount of citations received. This helps with intra-type citation comparisons.
            </p>
            <p>
              Annual citation totals are also summarized at the top of the chart, giving a quick overview of the most citations received across the yearly corpus.
            </p>
          </header>
          {
            loading ? (
              <>
              <div className="loading__container">
                <img alt="" src="/images/loading_icon.gif" />
                <p>Loading...</p>
              </div>
              </>
            ) : (
              <>
                <IntraChart d={intraData}>
                </IntraChart>
              </>
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
