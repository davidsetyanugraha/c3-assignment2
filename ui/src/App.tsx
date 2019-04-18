import React, { useRef, useEffect, useState } from 'react';
import './App.css';

import Map from './components/Map';

function App() {
  const target = useRef(null);
  const [state, setState] = useState(0);
  let map;

  useEffect(() => {
    // Force update.
    setState(1);
  }, []);

  if (target.current !== null) {
    map = Map(target);
  }

  return <div ref={target} className="map" id="map" />;
}

export default App;
