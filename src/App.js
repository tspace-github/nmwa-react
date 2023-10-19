import React from "react";
import ScreenOne from "./components/ScreenOne/ScreenOne.js";
import ScreenTwo from "./components/ScreenTwo/ScreenTwo.js";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import "./App.scss";

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://leon.tappingbones.works/wp-json/tapping/v1/members"
        );
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error occurred: {error.message}</p>;
  }

  return (
    <div>
      <Routes>
        <Route path="/screen-one" element={<ScreenOne data={data} />} />
        <Route path="/screen-two" element={<ScreenTwo data={data} />} />
      </Routes>
    </div>
  );
};

export default App;
