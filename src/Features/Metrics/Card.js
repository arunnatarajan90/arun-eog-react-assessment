import React, {useEffect} from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
  }
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;

export default ({metricName}) => {
  const classes = useStyles();
  const [lastMetricData, setlastMetricData] = React.useState({});

  let [getLastData] = useQuery({
    query,
    variables: {
      metricName
    }
  });
  const { data } = getLastData;
  useEffect(() => {
    if(data) {
      setlastMetricData(data.getLastKnownMeasurement);
    }
  }, [data]);
  return (
    <Provider value={client}>
      <div className={classes.metricCard}>
        <Typography variant="h6" gutterBottom>
          {metricName}
        </Typography>
        <Typography variant="h3" gutterBottom>
          {lastMetricData && lastMetricData.value}
        </Typography>
      </div>
    </Provider>
  );
};