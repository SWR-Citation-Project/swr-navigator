import React, { useState } from "react";
import Layout from "./Layout";
import LoadNetwork from "./LoadNetwork";


export default function Network() {
  const initialState = {
    network: null,
    filename: "/swr.ftree"
  };

  const [state, setState] = useState(initialState);

  if (!state.network) {
    return <React.Fragment>
      <LoadNetwork onLoad={setState}/>
    </React.Fragment>;
  }

  return <Layout {...state}/>;
}