import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Graph from './Graph';
import Card from './Card';

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
    <div style={{scroll: 'auto'}}>
      <div className={classes.metricContainer}>
        <div className={classes.metricsList}>
          {multipleMetricDataList.map(metric => {
            return <Card key={metric.metric} metricName={metric.metric} />
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