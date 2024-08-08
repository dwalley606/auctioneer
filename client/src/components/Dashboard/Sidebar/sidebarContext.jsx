import React, { useState, createContext, useContext } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import DashSidebar from "./DashSidebar";

const SidebarContext = createContext({});

export const DashSidebarProvider = ({ children }) => {
  const [sidebarRTL, setSidebarRTL] = useState(false);
  const [sidebarImage, setSidebarImage] = useState(undefined);

  return (
    <ProSidebarProvider>
      <SidebarContext.Provider
        value={{
          sidebarImage,
          setSidebarImage,
          sidebarRTL,
          setSidebarRTL,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: sidebarRTL ? "row-reverse" : "row",
          }}
        >
          <DashSidebar />
          <div style={{ flex: 1 }}>{children}</div>
        </div>
      </SidebarContext.Provider>
    </ProSidebarProvider>
  );
};

export const useSidebarContext = () => useContext(SidebarContext);
