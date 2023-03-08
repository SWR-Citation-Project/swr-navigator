import React from "react";
import "./Header.css";

const Header = () => (
  <header className="documentation">
    <div className="ui container">
      <div className="menu">
        {/* Header Text */}
        <div>
          <h1 className="ui header">
            <div className="content">
                <span className="brand">
                <a href="https://swr-network.netlify.app">
                  <span className="brand-infomap">SWR Citational Politics Dashboard</span>
                </a>
                </span>
              <div className="sub header">Enter tagline here</div>
            </div>
          </h1>
        </div>
        {/* NAV */}
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/network">Network</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

export default Header;
