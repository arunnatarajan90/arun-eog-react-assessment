import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import Graph from './Graph';

const useStyles = makeStyles({
  metricContainer: {
    display: 'flex',
    padding: '24px',
    overflow: 'auto'
  },
  metricsList: {
    width: '60%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  eachMetric: {
    width: '40%',
    padding: '16px 24px 16px 16px',
    color: 'rgba(0, 0, 0, 0.87)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: '#fff',
    borderRadius: '4px',
    marginBottom: '1rem',
    marginRight: '1rem',
  },
  metricDropdownContainer: {
    width: '40%'
  },
  metricDropdown: {
    width: '100%'
  }
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `{
  getMetrics
}
`;

const multipleMetricQuery = `
  query($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        metric
        at
        value
        unit
      }
    }
  }
`;

const getMetricsList = (state) => {
  const { metricsList } = state.metrics;
  return {
    metricsList
  };
};

const getMultipleMetricData = (state) => {
  const { multipleMetricDataList } = state.metrics;
  return {
    multipleMetricDataList
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const Metrics = () => {
  const classes = useStyles();
  
  const [metricSelected, setmetricSeleceted] = React.useState([]);

  const handleChange = (event) => {
    setmetricSeleceted(event.target.value);
  };

  const dispatch = useDispatch();
  const { metricsList } = useSelector(getMetricsList);
  const { multipleMetricDataList } = useSelector(getMultipleMetricData);

  const [getMetricsResult] = useQuery({
    query
  });
  let input = [];
  metricSelected.forEach(metric => {
    input.push({
      metricName: metric
    })
  });
  let [getMultipleMetricResult] = useQuery({
    query: multipleMetricQuery,
    variables: {
      input
    }
  });
  const { data, error } = getMetricsResult;
  const multiMetricData = getMultipleMetricResult.data;
  const multipleMetricError  = getMultipleMetricResult.error;
  useEffect(() => {
    if (error) {
      dispatch(actions.getMetricsApiErrorReceived({ error: error.message }));
      return;
    }
    if(multipleMetricError) {
      dispatch(actions.getMultipleMetricsDataApiErrorReceived({ error: multipleMetricError.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.getMetricsListRecevied(data));
    if (!multiMetricData) return;
    dispatch(actions.getMultipleMetricsDataReceived(multiMetricData));
    
  }, [dispatch, data, error, multiMetricData, multipleMetricError]);


  return (
    <div>
      <div className={classes.metricContainer}>
        <div className={classes.metricsList}>
          {multipleMetricDataList.map(metric => {
            return <div className={classes.eachMetric} key={metric.metric}>
              <Typography variant="h6" gutterBottom>
                {metric.metric}
              </Typography>
              <Typography variant="h3" gutterBottom>
                121.31
              </Typography>
            </div>
          })}
        </div>
        <div className={classes.metricDropdownContainer}>
          <Select
            className={classes.metricDropdown}
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            multiple
            value={metricSelected}
            onChange={handleChange}
            input={<Input />}
          >
            {metricsList.map(metric => {
              return <MenuItem value={metric} key={metric}>{metric}</MenuItem>
            })}
          </Select>
        </div>
      </div>
      <div>
        {multipleMetricDataList.length > 0 ? (
          <Graph graphData={multipleMetricDataList} />
        ) : null}
      </div>
    </div>
  )
}