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
import Button from '@material-ui/core/Button';
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
      console.log('change location');
      console.log(
        'value = ' +
          value +
          ' ,direction = ' +
          direction +
          ' ,level = ' +
          level +
          ' ,specific = ' +
          specific
      );
      let url = '';

      if (value === 'distance') {
        url =
          '/nectar/dashboard_source1/_design/summary/_view/mindistance?group=true';
      } else if (value === 'time') {
        url =
          '/nectar/dashboard_source1/_design/summary/_view/mintimediff?group=true';
      } else if (value === 'sins') {
        url =
          '/nectar/dashboard_source1/_design/summary/_view/sumsins?group=true';
      } else if (value === 'liveable') {
        url =
          '/nectar/dashboard_source1/_design/summary/_view/mindistance?group=true';
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

      json.forEach(e => {
        let from = e.key[0];
        let to = e.key[1];
        let val;

        if (value === 'distance') {
          val = e.value.min;
        } else if (value === 'time') {
          val = e.value.min;
        } else if (value === 'sins') {
          val = e.value.sum;
        } else if (value === 'liveable') {
          val = e.value.sum;
        }

        if (direction === 'from') {
          results[from] = val;
        } else if (direction === 'to') {
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
      let url = '';
      if ((direction === 'from') & (level === 'city')) {
        url =
          '/nectar/dashboard_source1/_design/summary/_view/fromCity?group=true';
      } else if ((direction === 'to') & (level === 'city')) {
        url =
          '/nectar/dashboard_source1/_design/summary/_view/toCity?group=true';
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
    // let sampleData = [
    //   {"key":"YARRIAMBIACK","value":2}
    //   ];

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

  function handleSubmit(event) {
    alert('Request was submitted: ' + specific);
    setSpecific(specific);
    event.preventDefault();
  }

  return (
    <div>
      <h2>Most Travel Distance Based on Tweets in a City</h2>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={16}>
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
                <MenuItem value="street">Street</MenuItem>
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
                <MenuItem value="liveable">Liveable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button variant="outlined" type="submit" value="Submit">
              Get Data
            </Button>
          </Grid>
        </Grid>
      </form>

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
