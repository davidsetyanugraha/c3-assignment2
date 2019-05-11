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

// Material components
import Grid from '@material-ui/core/Grid';

function ChartView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function populateData() {
      const response = await fetch('/local-server/agg-fav');
      const json = await response.json();

      const mappedData = Object.keys(json).map(key => {
        return {
          name: key,
          value: json[key]
        };
      });

      setData(mappedData);
    }

    populateData();
  }, []);

  return (
    <div>
      <h2>Untitled</h2>

      <Grid>
        <form>
          Direction:
          <select>
            <option value="from">From</option>
            <option value="to">To</option>
          </select>
          <div>
            Location Level:
            <select>
              <option value="city">City</option>
              <option value="street">Street</option>
            </select>
          </div>
          <div>
            Specific Location:
            <select>
              <option value="dummy1">
                dummy1(auto populated from location level)
              </option>
              <option value="dummy2">
                dummy2(auto populated from location level)
              </option>
            </select>
          </div>
          <div>
            Value:
            <select>
              <option value="distance">Distance</option>
              <option value="time">Time</option>
              <option value="sins">Sins</option>
              <option value="liveable">Liveable</option>
            </select>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </Grid>

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
