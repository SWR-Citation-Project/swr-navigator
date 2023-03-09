import React from "react";
import { Header, Image } from "semantic-ui-react";


export default function MenuHeader() {
  return <Header>
    <Image
      size="mini"
      verticalAlign="middle"
      src="//www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
      alt="mapequation-icon"
    />
    <div className="content menu_header">
      <span className="brand">
          <span className="brand-nn">SWR Network Navigator</span>
      </span>
      <p>
        Zoom in and out with your touchpad. Click on nodes to either drag and move or highlight their connections.
      </p>
      <p>
        Default detected "community" modules set to top 20. <br/><br/> Add or subtract the number of individual nodes in each module in the 'Settings' area. The default is set to the top 10 nodes (hubs) per "community" module.
      </p>
    </div>
  </Header>;
}
