import React from "react";
import { useSearchParams } from "react-router-dom";
import DashProfile from "../components/Dashboard/DashProfile";
import './css/Dashboard.css';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

    return (      
      <>
        <DashProfile />
      </>
    );
  };

export default Dashboard;


