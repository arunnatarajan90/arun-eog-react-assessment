import { createSlice, PayloadAction } from 'redux-starter-kit';

export type getMetricsAction = {
  getMetrics: [];
};

export type getMultipleMetricsDataAction = {
  getMultipleMeasurements: [];
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metricsList: [],
  multipleMetricDataList: [],
};

const slice = createSlice({
  name: 'getMetricsList',
  initialState,
  reducers: {
    getMetricsListRecevied: (state, action: PayloadAction<getMetricsAction>) => {
      const { getMetrics } = action.payload;
      state.metricsList = getMetrics;
    },
    getMetricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    getMultipleMetricsDataReceived: (state, action: PayloadAction<getMultipleMetricsDataAction>) => {
      const { getMultipleMeasurements } = action.payload;
      state.multipleMetricDataList = getMultipleMeasurements;
    },
    getMultipleMetricsDataApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
