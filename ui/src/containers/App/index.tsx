/* Import React modules */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
/* Import other node modules */
/* Import our modules */
import ErrorBoundary from "../../components/ErrorBoundary";
import SidebarWidget from "../SidebarWidget";
import AssetSidebarWidget from "../AssetSidebarWidget/AssetSidebarWidget";
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";

const App: React.FC = function () {
  return (
    <div className="app">
      <ErrorBoundary>
        <BrowserRouter>
          {/* If the path is changed here,
              be sure to update the path for corresponding UI location
              in Update App API */
          /* Below list has all the possible UI paths\.
              Keep only the paths that are required for your app and
              remove the remaining paths and their source code also. */}
          <Routes>
            <Route path="/asset-sidebar-widget" element={<SidebarWidget />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
};

export default App;
