// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

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
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  form: {
    display: 'flex'
  },
  chart: {
    marginTop: theme.spacing.unit * 2
  }
});

function ChartView({ classes }) {
  const [direction, setDirection] = useState('from');
  const [level, setLevel] = useState('city');
  const [specific, setSpecific] = useState('');
  const [value, setValue] = useState('distance');

  const [data, setData] = useState([]);

  useEffect(() => {
    async function populateData() {
      let url = '';

      if (value === 'distance') {
        url =
          '/nectar/analysis_extended/_design/summary/_view/mindistance?group=true';
      } else if (value === 'time') {
        url =
          '/nectar/analysis_extended/_design/summary/_view/mintimediff?group=true';
      } else if (value === 'sins') {
        url =
          '/nectar/analysis_extended/_design/summary/_view/sumsins?group=true';
      }

      const response = await fetch(url);
      const jres = await response.json();
      const json = processData(jres.rows);

      let mappedData = Object.keys(json).map(key => {
        return {
          name: key,
          value: json[key]
        };
      });
      mappedData.sort(compare);
      mappedData.reverse();
      mappedData = getNFirst(mappedData, 5); //

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

      json.forEach(e => {
        let from = e.key[0];
        let to = e.key[1];
        let val;

        if (value === 'distance') {
          val = e.value.min;
        } else if (value === 'time') {
          val = e.value.min;
        } else if (value === 'sins') {
          val = e.value.reduce((a,b) => a + b, 0);
        }

        if ((direction === 'from') & (from === specific)) {
          results[to] = val;
        } else if ((direction === 'to') & (to === specific)) {
          results[from] = val;
        }
      });

      return results;
    }

    function compare(a, b) {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    }

    populateData();
  }, [direction, level, specific, value]);

  const [location, setLocation] = useState([]);

  useEffect(() => {
    async function fetchLocations(direction, level) {
      let url = '';
      if ((direction === 'from') & (level === 'city')) {
        url =
          '/nectar/analysis_extended/_design/summary/_view/fromCity?group=true';
      } else if ((direction === 'to') & (level === 'city')) {
        url =
          '/nectar/analysis_extended/_design/summary/_view/toCity?group=true';
      }

      console.log('calling: ' + url);
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const data = json.rows;
        setSpecific(data[0].key);
        setLocation(data);
      } else {
        alert('HTTP-Error: ' + response.status);
      }
    }

    fetchLocations(direction, level);
  }, [direction, level]);

  function generateLocations() {
    let locations = [];

    if ((direction === 'from') & (level === 'city')) {
      location.forEach(e => {
        locations.push(
          <MenuItem key={e.key} value={e.key}>
            {' '}
            {e.key}{' '}
          </MenuItem>
        );
      });
    } else if ((direction === 'to') & (level === 'city')) {
      location.forEach(e => {
        locations.push(
          <MenuItem key={e.key} value={e.key}>
            {' '}
            {e.key}{' '}
          </MenuItem>
        );
      });
    }

    return locations;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <Grid container spacing={16} className={classes.form}>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel htmlFor="direction">Direction</InputLabel>
            <Select
              value={direction}
              onChange={e => setDirection(e.target.value)}
              inputProps={{
                name: 'direction',
                id: 'direction'
              }}
            >
              <MenuItem value="from">From</MenuItem>
              <MenuItem value="to">To</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel htmlFor="location-level">Location Level</InputLabel>
            <Select
              value={level}
              onChange={e => setLevel(e.target.value)}
              inputProps={{
                name: 'location-level',
                id: 'location-level'
              }}
            >
              <MenuItem value="city">City</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel htmlFor="specific-location">
              Specific Location
            </InputLabel>
            <Select
              value={specific}
              onChange={e => setSpecific(e.target.value)}
              inputProps={{
                name: 'specific-location',
                id: 'specific-location'
              }}
            >
              {generateLocations()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel htmlFor="value">Value</InputLabel>
            <Select
              value={value}
              onChange={e => setValue(e.target.value)}
              inputProps={{
                name: 'specific-location',
                id: 'specific-location'
              }}
            >
              <MenuItem value="distance">Distance</MenuItem>
              <MenuItem value="time">Time</MenuItem>
              <MenuItem value="sins">Sins</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <h2>
        Top 5 {level} {direction} {specific} by {value}
      </h2>

      <div className={classes.chart}>
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
    </div>
  );
}

export default withStyles(styles)(ChartView);
