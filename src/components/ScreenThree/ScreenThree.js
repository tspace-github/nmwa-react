import gsap from "gsap";
import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import he from "he";

import "./ScreenThree.scss";

const ScreenThree = ({ data }) => {
  const [allDataSetKeys] = useState(["nmwa-next"]);
  const [level, setLevel] = useState(0);
  const [dataSetKeyIndex, setDataSetKeyIndex] = useState(0);
  const [rootFontSize, setRootFontSize] = useState(10);
  const datasetkey = allDataSetKeys[dataSetKeyIndex];
  const levelLength = data[datasetkey]["levels"].length;

  useLayoutEffect(() => {
    // Add a class to the body element when the component mounts
    document.body.classList.add("scr-three");

    // Remove the class when the component unmounts (optional)
    return () => {
      document.body.classList.remove("scr-three");
    };
  }, []);

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

  // console.log('dataSetKeyIndex: ', dataSetKeyIndex, datasetkey, levelLength, 'level: ', level);

  return (
    <div className="app">
      <InfoColumn
        allDataSetKeys={allDataSetKeys}
        activeKeyIndex={dataSetKeyIndex}
        data={data}
        level={level}
      />
      <div className="auto-scroll-wrapper">
        <div className="dont-overflow">
          <AutoScrollingComponent
            key={datasetkey + "-" + level}
            startDelay={0}
            endDelay={2000}
            onComplete={onComplete}
            speed={150}
            fadeInOutDuration={1.5}
            rootFontSize={rootFontSize}
          >
            <div className="columns-container" id={datasetkey + "-" + level}>
              {renderHtml(data, datasetkey, level, rootFontSize)}
            </div>
          </AutoScrollingComponent>
        </div>
      </div>
    </div>
  );
};

const AutoScrollingComponent = ({
  children,
  startDelay = 0,
  endDelay = 2000,
  onComplete,
  speed = 70,
  fadeInOutDuration = 1.5,
  rootFontSize,
}) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const animationSpeed = speed;
    const yOffset = 24;
    let columnHeight = containerRef.current.offsetHeight;
    columnHeight =
      columnHeight > window.innerHeight ? columnHeight : window.innerHeight;

    const finalY = -columnHeight + window.innerHeight;
    const bottomToTopDuration = (finalY * -1 * animationSpeed) / 10000;
    const isRightToLeft = finalY === 0;
    const startX = isRightToLeft ? 25 : 0;

    const context = gsap.context(() => {
      const tl = gsap.timeline({
        delay: startDelay / 1000,
        onComplete: () => {
          // console.log("oncomplete");
          if (typeof onComplete === "function") {
            setTimeout(() => {
              onComplete();
            }, endDelay);
          }
        },
      });

      if (isRightToLeft) {
        tl.fromTo(
          containerRef.current,
          {
            y: `${yOffset}rem`,
            x: startX,
            duration: fadeInOutDuration,
            ease: "linear",
            opacity: 0,
          },
          {
            y: `${yOffset}rem`,
            x: 0,
            opacity: 1,
          }
        );
      } else {
        tl.to(containerRef.current, {
          y: `${yOffset}rem`,
          duration: fadeInOutDuration,
          opacity: 1,
          ease: "none",
        });
        tl.fromTo(
          containerRef.current,
          {
            y: `${yOffset}rem`,
          },
          {
            duration: bottomToTopDuration,
            y: finalY,
            ease: "linear",
            paused: false,
          }
        );
      }

      tl.play();
    });

    return () => {
      context.revert();
    };
    // tl.play();
  }, [
    containerRef,
    startDelay,
    endDelay,
    onComplete,
    speed,
    fadeInOutDuration,
  ]);

  return (
    <div className="animation-container" ref={containerRef}>
      {children}
    </div>
  );
};

const renderHtml = (data, datasetkey, level, rootFontSize) => {
  // console.log('renderHtml:');
  const levelNames = data[datasetkey]["levels"][level]["names"];
  const nameFontSize = data[datasetkey]["levels"][level]["fontSize"];
  const nameLineHeight = data[datasetkey]["levels"][level]["leading"];
  const nameMargin = data[datasetkey]["levels"][level]["paragraphSpacing"];
  const htmlContent = renderDataColumns(
    levelNames,
    nameFontSize,
    nameLineHeight,
    nameMargin,
    rootFontSize
  );
  return htmlContent;
};

const renderDataColumns = (
  names,
  nameFontSize,
  nameLineHeight,
  nameMargin,
  rootFontSize
) => {
  const nameColumns = splitNamesIntoColumns(names);

  const nameStyle = {
    fontSize: `${nameFontSize / (2 * rootFontSize)}rem`,
    lineHeight: nameLineHeight / nameFontSize,
    marginBottom: `${nameMargin / (2 * rootFontSize)}rem`,
  };

  return nameColumns.map((column, index) => (
    <div key={index} className="column">
      {column.map((name, nameIndex) => (
        <div
          key={nameIndex}
          className="name"
          style={nameStyle}
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

const InfoColumn = ({ allDataSetKeys, activeKeyIndex, data, level }) => {
  // console.log('InfoColumn: ', allDataSetKeys, activeKeyIndex, data, level)

  return (
    <div className="header-bar">
      <div className="main-header-text">
        <h1>With Thanks</h1>
      </div>
      <div className="secondary-header-text">
        <div className="sub-headings">
          <h2>
            {data[allDataSetKeys[activeKeyIndex]]["campaignInfo"][0]["title"]}
          </h2>
        </div>
        <div
          className="description"
          dangerouslySetInnerHTML={{
            __html:
              data[allDataSetKeys[activeKeyIndex]]["campaignInfo"][0][
                "description"
              ],
          }}
        ></div>
      </div>
    </div>
  );
};

export default ScreenThree;
