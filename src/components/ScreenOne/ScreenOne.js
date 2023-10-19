import gsap from "gsap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ScreenOne.scss";
import Logo from "../../assets/NMWA-logo.svg";

const ScreenOne = ({ data }) => {
  const [allDataSetKeys] = useState(["cumulative", "current-year-2023"]);
  const [level, setLevel] = useState(0);
  const [dataSetKeyIndex, setDataSetKeyIndex] = useState(0);
  const datasetkey = allDataSetKeys[dataSetKeyIndex];
  const levelLength = data[datasetkey]["levels"].length;

  const onComplete = useCallback(() => {
    if (level === levelLength - 1) {
      setLevel(0);
      if (dataSetKeyIndex === allDataSetKeys.length - 1) {
        setDataSetKeyIndex(0);
      } else {
        setDataSetKeyIndex(dataSetKeyIndex + 1);
      }
    } else {
      setLevel(level + 1);
    }
  }, [level, levelLength, dataSetKeyIndex, allDataSetKeys.length]);

  return (
    <div className="app">
      <InfoColumn
        allDataSetKeys={allDataSetKeys}
        activeKeyIndex={dataSetKeyIndex}
        data={data}
        level={level}
      />

      <AutoScrollingComponent
        startDelay={0}
        endDelay={2000}
        onComplete={onComplete}
        speed={100}
        key={datasetkey + "-" + level}
        fadeInOutDuration={1.5}
      >
        <div className="columns-container" id={datasetkey + "-" + level}>
          {renderHtml(data, datasetkey, level)}
        </div>
      </AutoScrollingComponent>
    </div>
  );
};

const AutoScrollingComponent = ({
  children,
  startDelay = 0,
  endDelay = 0,
  onComplete,
  speed = 50,
  fadeInOutDuration = 0.5,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const animationSpeed = speed;
    let columnHeight = containerRef.current.offsetHeight;
    columnHeight =
      columnHeight > window.innerHeight ? columnHeight : window.innerHeight;
    const duration = (columnHeight * animationSpeed) / 10000;
    const finalY =
      -columnHeight - containerRef.current.offsetTop + window.innerHeight;

    const tl = gsap.timeline({
      delay: startDelay / 1000,
      onComplete: () => {
        if (typeof onComplete === "function") {
          setTimeout(() => {
            onComplete();
          }, endDelay);
        }
      },
    });

    tl.to(containerRef.current, {
      duration: fadeInOutDuration,
      opacity: 1,
      ease: "none",
    });

    tl.to(containerRef.current, {
      duration: duration,
      y: finalY,
      ease: "linear",
      paused: false,
    });

    // tl.play();
  }, [containerRef, startDelay, endDelay]);

  return (
    <div className="aniamtion-container" ref={containerRef}>
      {children}
    </div>
  );
};

const InfoColumn = ({ allDataSetKeys, activeKeyIndex, data, level }) => {
  const getDsetsAndLevels = () => {
    return allDataSetKeys.map((dskey, index) => (
      <div key={index} className={index === activeKeyIndex ? "active" : ""}>
        <h2 className="set-title">
          {data[allDataSetKeys[index]]["campaignInfo"][0]["title"]
            ? data[allDataSetKeys[index]]["campaignInfo"][0]["title"]
            : ""}
        </h2>
        <h3 className="level-title">
          {data[allDataSetKeys[index]]["levels"][level]["title"]
            ? data[allDataSetKeys[index]]["levels"][level]["title"]
            : ""}
        </h3>
        <h4 className="level-desc">
          {data[allDataSetKeys[index]]["levels"][level]["description"]
            ? data[allDataSetKeys[index]]["levels"][level]["description"]
            : ""}
        </h4>
      </div>
    ));
  };

  return (
    <div className="column left-col">
      <h1>With Thanks</h1>
      <p>
        NMWA is deeply grateful to supporters of the Legacy of Women in the Arts
        Endowment Campaign, individual donors and organizations, and members of
        the Legacy Society.
      </p>

      {getDsetsAndLevels()}

      <div class="footer">
        <img src={Logo} alt="NMWA Logo" />
      </div>
    </div>
  );
};

const renderHtml = (data, datasetkey, level) => {
  // console.log('renderHtml:');
  const levelNames = data[datasetkey]["levels"][level]["names"];
  // console.log(
  //   "count of names: ",
  //   Object.keys(data[datasetkey]["levels"][level]["names"]).length
  // );
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
  // console.log('splitNamesIntoColumns:');
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

export default ScreenOne;
