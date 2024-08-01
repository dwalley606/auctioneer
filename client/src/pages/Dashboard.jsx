// client/src/pages/Dashboard.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import DashProfile from "../components/Dashboard/DashProfile";
import './css/Dashboard.css';


const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  return (      
    <div>
      <h1>Dashboard</h1>
      <p>Current tab: {tab}</p>
      {/* Render content based on the tab parameter */}
      {tab === "profile" && <div>Profile Content</div>}
      {/* Add other tab contents here */}
    </div>
  );
};

export default Dashboard;
