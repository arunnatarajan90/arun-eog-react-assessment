import React, { useEffect } from 'react';
import { Provider, createClient } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/react-hooks';

const useStyles = makeStyles({
  metricCard: {
    width: '30%',
    padding: '16px 24px 16px 16px',
    color: 'rgba(0, 0, 0, 0.87)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: '#fff',
    borderRadius: '4px',
    marginBottom: '1rem',
    marginRight: '1rem',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const newMeasurementsSub = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

export default ({ metricName }) => {
  const classes = useStyles();
  const [metricData, setMetricData] = React.useState({});

  const { loading, data } = useSubscription(newMeasurementsSub);

  useEffect(() => {
    if (data) {
      if (data.newMeasurement && data.newMeasurement.metric === metricName) {
        setMetricData(data.newMeasurement);
      }
    }
  }, [loading, data]);

  return (
    <Provider value={client}>
      <div className={classes.metricCard}>
        <Typography variant="h6" gutterBottom>
          {metricName}
        </Typography>
        <Typography variant="h3" gutterBottom>
          {metricData && metricData.value}
        </Typography>
      </div>
    </Provider>
  );
};
