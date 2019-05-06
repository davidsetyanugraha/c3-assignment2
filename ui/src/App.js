import React, { useRef, useEffect, useState, Fragment } from 'react';
import './App.css';

import generateMap from './components/Map';

function App() {
  const target = useRef(null);
  const overlayWrapper = useRef(null);
  const [, setState] = useState(0);
  const [content, setContent] = useState(undefined);
  const [map, setMap] = useState(undefined);

  useEffect(function() {
    // Force update.
    setState(1);

    async function getMap() {
      return await generateMap(target, overlayWrapper, setContent, map);
    }

    const newMap = getMap();
    if (target.current !== null) {
      setMap(newMap);
    }

    return () => {};
  }, []);

  return (
    <Fragment>
      <div ref={target} className="map" id="map" />
      <div ref={overlayWrapper}>{content}</div>
    </Fragment>
  );
}

export default App;
