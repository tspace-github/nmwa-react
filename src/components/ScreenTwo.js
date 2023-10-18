import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./ScreenOne/ScreenTwo.css";

const names2022 = generateNamesArray(500);
const names2023 = generateNamesArray(500);

function generateNamesArray(count) {
  const namesArray = [];
  for (let i = 1; i <= count; i++) {
    namesArray.push(`name${i}`);
  }
  return namesArray;
}

const App = ({ data }) => {
  console.log(data);

  const [show2022, setShow2022] = useState(true);

  const containerRef = useRef(null);

  useEffect(() => {
    // const animationSpeed = 0.02; // Animation speed in seconds
    const animationSpeed = 0.002; // Animation speed in seconds
    const pauseAfterCompletion = 3000;
    const fadeInOutDuration = 3;

    const columnHeight =
      containerRef.current.offsetHeight + containerRef.current.offsetTop;

    const initalY = -containerRef.current.offsetTop;
    const finalY = -columnHeight + window.innerHeight;
    const duration = animationSpeed * columnHeight;

    console.log(window.innerHeight);

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(containerRef.current, {
      duration: fadeInOutDuration,
      opacity: 1,
      ease: "linear",
    });

    tl.fromTo(
      containerRef.current,
      {
        y: initalY,
      },
      {
        y: finalY, // Assuming 2 columns visible at a time
        ease: "linear",
        duration: duration,
        onComplete: () => {
          tl.pause();
          setTimeout(() => {
            setShow2022((prev) => !prev);
            tl.restart();
          }, pauseAfterCompletion);
        },
      }
    );

    tl.set(containerRef.current, { y: 0 });

    return () => {
      tl.kill(); // Kill the animation on component unmount
    };
  }, [show2022]); // Empty dependency array ensures the effect runs once after the initial render

  const renderColumns = (names) => {
    const columnSize = names.length / 3;
    const columns = [[], [], []];

    for (let i = 0; i < names.length; i++) {
      const columnIndex = Math.floor(i / columnSize);
      columns[columnIndex].push(names[i]);
    }

    return columns.map((column, index) => (
      <div key={index} className="column">
        {column.map((name, nameIndex) => (
          <div key={nameIndex} className="name">
            {name}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="app">
      {show2022 && (
        <div ref={containerRef} className="columns-container" id="div-2022">
          {renderColumns(names2022)}
        </div>
      )}
      {!show2022 && (
        <div ref={containerRef} className="columns-container" id="div-2023">
          {renderColumns(names2023)}
        </div>
      )}
    </div>
  );
};

export default App;
