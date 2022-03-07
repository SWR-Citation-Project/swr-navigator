import React from "react";
import "./Header.css";


const Header = () => (
  <header className="documentation">
    <div className="ui container">
      <div className="menu">
        <div>
          <h1 className="ui header">
            <div className="content">
                <span className="brand">
                <a href="https://swr-network.netlify.app">
                  <span className="brand-infomap">SWR Citation Network</span>
                </a>
                </span>
              <div className="sub header">Interactive hierarchical network navigator</div>
            </div>
          </h1>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
