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
  const [chart, setChart] = useState([]);

  useEffect(() => {
    async function populateData() {
      console.log("change location");
      console.log("value = " + value + " ,direction = " + direction + " ,level = " + level + " ,specific = " + specific );
      let url = '';

      if (value == "distance") {
        url = '/nectar/dashboard_source1/_design/summary/_view/mindistance?group=true';
      } else if (value == "time") {
        url = '/nectar/dashboard_source1/_design/summary/_view/mintimediff?group=true';
      } else if (value == "sins") {
        url = '/nectar/dashboard_source1/_design/summary/_view/sumsins?group=true';
      } else if (value == "liveable") {
        url = '/nectar/dashboard_source1/_design/summary/_view/mindistance?group=true';
      }

      const response = await fetch(url);
      const jres = await response.json();
      const json = await processData(jres.rows);

      const mappedData = Object.keys(json).map(key => {
        return {
          name: key,
          value: json[key]
        };
      });

      setData(mappedData);
    }

    async function processData(json) {
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

        if (direction === "from") {
          results[from] = val;
        } else if (direction === "to") {
          results[to] = val;
        }
      });

      return results;
    }

    populateData();
  }, [specific]);

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

  function handleSubmit(event) {
    alert('Request was submitted: ' + specific);
    setSpecific(specific);
    event.preventDefault();
  }

  return (
    <div>
      <h2>Untitled</h2>
      <form onSubmit={handleSubmit}>
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
        <input type="submit" value="Submit" />
      </form>

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
