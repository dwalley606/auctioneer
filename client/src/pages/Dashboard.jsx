import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashComponent from "../components/Dashboard/Component/DashComponent";
import DashProfile from "../components/Dashboard/Profile/DashProfile";
import DashProducts from "../components/Dashboard/Products/Products";
import DashMessages from "../components/Dashboard/Messages/DashMessages";
import DashAuctions from "../components/Dashboard/Auctions/DashAuctions";
import Topbar from "../components/Dashboard/Topbar/Topbar";
import "./css/Dashboard.css";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    console.log("Dashboard component mounted or location.search changed");
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    console.log("Tab from URL:", tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
      console.log("Set tab state to:", tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    console.log("Current tab state:", tab);
  }, [tab]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Topbar />
      </div>
      <div className="dashboard-body">
        <div className="dashboard-content">
          {tab === "" && <DashComponent />} {/* Default tab */}
          {tab === "component" && <DashComponent />}
          {tab === "profile" && <DashProfile />}
          {tab === "products" && <DashProducts />}
          {tab === "messages" && <DashMessages />}
          {tab === "auctions" && <DashAuctions />}
        </div>
      </div>
    </div>
  );
}
