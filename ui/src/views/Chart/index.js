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
  const [data, setData] = useState([]);

  useEffect(() => {
    async function populateData() {
      const response = await fetch('/agg_favorite_cat.json');
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
      <h2>Range of Liked Tweets Across Melbourne</h2>
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
