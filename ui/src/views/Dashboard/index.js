import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

function ChartView() {
  const [direction, setDirection] = useState("from");
  const [level, setLevel] = useState("city");
  const [specific, setSpecific] = useState("");
  const [value, setValue] = useState("distance");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function populateData() {
      let url = '';

      if (value === "distance") {
        url = '/nectar/dashboard_source1/_design/summary/_view/mindistance?group=true';
      } else if (value === "time") {
        url = '/nectar/dashboard_source1/_design/summary/_view/mintimediff?group=true';
      } else if (value === "sins") {
        url = '/nectar/dashboard_source1/_design/summary/_view/sumsins?group=true';
      } else if (value === "liveable") {
        url = '/nectar/dashboard_source1/_design/summary/_view/mindistance?group=true';
      }
      console.log("set new mapped data");
      console.log("value = " + value + " ,direction = " + direction + " ,level = " + level + " ,specific = " + specific );

      const response = await fetch(url);
      const jres = await response.json();
      const json = processData(jres.rows);

      let mappedData = Object.keys(json).map(key => {
        return {
          name: key,
          value: json[key]
        };
      });
      mappedData.sort( compare );
      mappedData.reverse();
      mappedData = getNFirst(mappedData, 5);//

      console.log("new mapped data");
      console.log(mappedData);
      


      setData(mappedData);
    }

    function getNFirst(mappedData, n) {
      let result = [];
      if (mappedData.length >= n) {
        for (var i = 0; i < n; i++) {
          result.push(mappedData[i]);
        }
      } else {
        result = mappedData;
      }
      return result;
    }

    function processData(json) {
      let results = [];

      json.forEach((e) => {
        let from = e.key[0];
        let to = e.key[1];
        let val;
        
        if (value === "distance") {
          val = e.value.min; 
        } else if (value === "time") {
          val = e.value.min; 
        } else if (value === "sins") {
          val = e.value.sum; 
        } else if (value === "liveable") {
          val = e.value.sum; 
        }

        if ((direction === "from") & (from === specific)) {
          results[to] = val;
        } else if ((direction === "to") & (to === specific)){
          results[from] = val;
        }
      });

      return results;
    }

    function compare( a, b ) {
      if ( a.value < b.value ){
        return -1;
      }
      if ( a.value > b.value ){
        return 1;
      }
      return 0;
    }

    populateData();

  }, [direction,level,specific,value]);

  const [location, setLocation] = useState([]);

  useEffect(() => {
    async function fetchLocations(direction, level) {
      let url = "";
      if ((direction === "from") & (level === "city")) {
        url = '/nectar/dashboard_source1/_design/summary/_view/fromCity?group=true';
      } else if ((direction === "to") & (level === "city")) {
        url = '/nectar/dashboard_source1/_design/summary/_view/toCity?group=true';
      }

      console.log("calling: " + url);
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();        
        const data = json.rows;
        setSpecific(data[0].key);
        setLocation(data);
      } else {
        alert("HTTP-Error: " + response.status);
      }
    }

    fetchLocations(direction,level);
  }, [direction,level]);

  function generateLocations() {
    // let sampleData = [
    //   {"key":"YARRIAMBIACK","value":2}
    //   ];

    let locations = [];  

    if ((direction === "from") & (level === "city")) {
      location.forEach((e) => {
        locations.push(<option key= {e.key} value={e.key}> {e.key} </option>);
      });
    } else if ((direction === "to") & (level === "city")) {
      location.forEach((e) => {
        locations.push(<option key= {e.key} value={e.key}> {e.key} </option>);
      });
    }

    return locations;
  }  

  return (
    <div>
      <h2>Dashboard</h2>

        <div>
          Direction:
          <select value={direction} onChange={e => setDirection(e.target.value)}>
            <option value="from">From</option>
            <option value="to">To</option>
          </select>
        </div>

        <div>
          Location Level:
          <select value={level} onChange={e => setLevel(e.target.value)}>
            <option value="city">City</option>
            <option value="street">Street</option>
          </select>
        </div>

        <div>
          Specific Location:
          <select value={specific} onChange={e => setSpecific(e.target.value)} >
            {generateLocations()}
          </select>
        </div>

        <div>
          Value:
          <select value={value} onChange={e => setValue(e.target.value)}>
            <option value="distance">Distance</option>
            <option value="time">Time</option>
            <option value="sins">Sins</option>
            <option value="liveable">Liveable</option>
          </select>
        </div>
      
      <h2>Top 5 {level} {direction} {specific} by {value}</h2>

      <BarChart
        width={800}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default ChartView;
