import React from "react";
import {FaMusic,FaChartBar,FaCrown} from "react-icons/fa";

export default function Navbar({setPage}){

  return(
    <div className="navbar">

      <h2>🎧 Synq Music Platform</h2>

      <div className="nav-buttons">

        <button onClick={()=>setPage("home")}>
          <FaMusic/> Content
        </button>

        <button onClick={()=>setPage("subscription")}>
          <FaCrown/> Subscription
        </button>

        <button onClick={()=>setPage("analytics")}>
          <FaChartBar/> Analytics
        </button>

      </div>

    </div>
  )
}