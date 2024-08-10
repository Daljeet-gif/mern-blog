import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashBoardComponent from "../components/DashBoardComponent";

export default function Dashboard() {
  const lacation = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [lacation]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar></DashSideBar>
      </div>
      
      {tab === "profile" && <DashProfile></DashProfile>}
      {tab === "comments" && <DashComments></DashComments>}
      {tab === "post" && <DashPost></DashPost>}
      {tab === "users" && <DashUsers></DashUsers>}
      {tab === "dash" && <DashBoardComponent></DashBoardComponent>}
    </div>
  );
}
