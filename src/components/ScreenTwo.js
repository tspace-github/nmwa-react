import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./ScreenOne/ScreenTwo.css";

const App = ({ data }) => {
  // console.log(data);
  const [level, setLevel] = useState(0);
  const [datasetkey, setDatasetkey] = useState("cumulative");
  const [repeatLoop, setRepeatLoop] = useState(false);

  const containerRef = useRef(null);

  // render html for the animation

  const renderHtml = (datasetkey, level) => {
    const levelNames = data[datasetkey]["levels"][level]["names"];
    console.log(
      "count of names: ",
      Object.keys(data[datasetkey]["levels"][level]["names"]).length
    );
    const htmlContent = renderDataColumns(levelNames);
    return htmlContent;
  };

  const renderDataColumns = (names) => {
    const nameColumns = splitNamesIntoColumns(names);

    return nameColumns.map((column, index) => (
      <div key={index} className="column">
        {column.map((name, nameIndex) => (
          <div
            key={nameIndex}
            className="name"
            dangerouslySetInnerHTML={{ __html: name }}
          ></div>
        ))}
      </div>
    ));
  };

  const splitNamesIntoColumns = (data) => {
    const splitIntoColumns = (namesObject) => {
      const namesArray = namesObject.map((name) =>
        Array.isArray(name) ? name.join("<br />") : name
      );
      const totalNames = namesArray.length;
      const namesPerColumn = Math.ceil(totalNames / 3);
      const columns = [];
      for (let i = 0; i < totalNames; i += namesPerColumn) {
        const column = namesArray.slice(i, i + namesPerColumn);
        columns.push(column);
      }

      return columns;
    };
    const sortedNamesObjectKeys = Object.keys(data).sort();
    const sortedNamesArray = [];
    sortedNamesObjectKeys.forEach((key) => {
      sortedNamesArray.push(data[key]);
    });
    const allColumns = splitIntoColumns(sortedNamesArray);
    return allColumns;
  };

  // keep looping for different datasets and levels

  const playAnimations = async () => {
    for (const keystr in data) {
      if (keystr === "cumulative" || keystr === "current-year-2023") {
        for (let mylevel in data[keystr]["levels"]) {
          // console.log(keystr, data[keystr]["levels"]);

          setDatasetkey((prevDatasetKey) => {
            return keystr; // Set the state to the new value
          });

          setLevel((prevLevel) => {
            return mylevel; // Set the state to the new value
          });

          await startAnimation(keystr, mylevel);

          if (keystr === "current-year-2023" && mylevel === "4") {
            setRepeatLoop(!repeatLoop);
          }
        }
      } else {
        continue;
      }
    }
  };

  const startAnimation = async (currentKey, currentLevel) => {
    const animationSpeed = 45; // Animation speed in seconds - higher value means slower
    const pauseAfterCompletion = 3000;
    const fadeInOutDuration = 3;
    let columnHeight = containerRef.current.offsetHeight;
    columnHeight =
      columnHeight > window.innerHeight ? columnHeight : window.innerHeight;
    const duration =
      (columnHeight * animationSpeed) / 10000 + pauseAfterCompletion / 1000;
    const initialY = 0;
    const finalY = -columnHeight - containerRef.current.offsetTop;

    // console.log("inside startAnimation: ", datasetkey, level);

    console.log(
      currentKey + "-" + currentLevel,
      "columnHeight: ",
      containerRef.current.offsetHeight,
      "duration: ",
      duration,
      "initialY: ",
      initialY,
      "finalY: ",
      finalY
    );

    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      duration: fadeInOutDuration,
      opacity: 1,
      ease: "linear",
    });

    await tl
      .fromTo(
        containerRef.current,
        {
          y: initialY,
          x: 0,
        },
        {
          x: 0,
          y: finalY,
          ease: "linear",
          duration: duration,
        }
      )
      .then(() => {
        tl.pause();
        setTimeout(() => {
          tl.resume();
        }, pauseAfterCompletion);
      });
  };

  useEffect(() => {
    playAnimations();
  }, [repeatLoop]);

  // const startAnimation = () => {
  //   const animationSpeed = 45; // Animation speed in seconds - higher value means slower
  //   const pauseAfterCompletion = 3000;
  //   const fadeInOutDuration = 3;

  //   let columnHeight = containerRef.current.offsetHeight;

  //   columnHeight =
  //     columnHeight > window.innerHeight ? columnHeight : window.innerHeight;

  //   const tl = gsap.timeline({ repeat: -1 });

  //   tl.to(containerRef.current, {
  //     duration: fadeInOutDuration,
  //     opacity: 1,
  //     ease: "linear",
  //   });

  //   tl.fromTo(
  //     containerRef.current,
  //     {
  //       y: -containerRef.current.offsetTop,
  //       x: 0,
  //     },
  //     {
  //       x: 0,
  //       y: -columnHeight - containerRef.current.offsetTop + window.innerHeight,
  //       ease: "linear",
  //       duration: (animationSpeed * columnHeight) / 10000, // 10000 is just a scaling factor
  //       onComplete: () => {
  //         tl.pause();
  //         setTimeout(() => {
  //           tl.restart();
  //         }, pauseAfterCompletion);
  //       },
  //     }
  //   );

  //   tl.set(containerRef.current, { y: 0 });

  //   return () => {
  //     tl.kill(); // Kill the animation on component unmount
  //   };
  // };

  return (
    <div className="app">
      <div
        ref={containerRef}
        className="columns-container"
        id={datasetkey + "-" + level}
      >
        {renderHtml(datasetkey, level)}
      </div>
    </div>
  );
};

export default App;
