import React from 'react'
import { useState, useMemo, useEffect } from 'react';

import Content from './Content';
import View from './View';

const ScreenOne = ({data}) => {

    const cumulativeData = data["cumulative"];
    const currentYearData = data["current-year-2023"];

    const [currentViewIndex, setCurrentViewIndex] = useState(1);

    const viewData = useMemo(
      () => [
        {
          view: 1,
          data: cumulativeData,
        },
        {
          view: 2,
          data: currentYearData,
        },
      ],
      [] // Empty dependency array ensures useMemo runs only once
    );


    // useEffect(() => {
    //   setTimeout(() => {
    //     setCurrentViewIndex(prev => ((prev === 1) ? 2 : 1) );
    //   }, 3000);
  
    // });
    
    // console.log(currentViewIndex)

    const currentView = viewData[currentViewIndex - 1];

    console.log(currentView)


    return (
      <div className={`view fadeInOut view${currentView.view}`}>
        {currentViewIndex === 1 ? (
          <View data={currentView.data[currentView.currentIndex]} />
        ) : (
          <View data={currentView.data[currentView.currentIndex]} />
        )}
      </div>
    )
}


const View1 = ({ data }) => {
  return <h1>View 1</h1>; 
};

const View2 = ({ data }) => {
  return <h1>View 2</h1>;
};

export default ScreenOne
