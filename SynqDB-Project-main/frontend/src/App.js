import React,{useState} from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import ContentList from "./components/ContentList";
import Subscription from "./components/Subscription";
import Analytics from "./components/Analytics";

export default function App(){

  const [page,setPage] = useState("home");

  return(
    <div>

      <Navbar setPage={setPage}/>

      <div className="container">

        {page==="home" && <ContentList/>}

        {page==="subscription" && <Subscription/>}

        {page==="analytics" && <Analytics/>}

      </div>

    </div>
  )
}