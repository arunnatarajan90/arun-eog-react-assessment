import React from 'react';

const LineChart = window.Recharts.LineChart;
const Line = window.Recharts.Line;
const XAxis = window.Recharts.XAxis;
const YAxis = window.Recharts.YAxis;
const Legend = window.Recharts.Legend;
const Tooltip = window.Recharts.Tooltip;

export default ({graphData = []}) => {
  let totalData = [];
  graphData.forEach(entry => {
    entry.measurements.forEach((value, index) => {
      if(totalData[index] === undefined) {
        totalData.push({
          at: value.at,
        })
      }
      totalData[index][`${value.metric}Value`] = value.value;
      totalData[index][`${value.metric}Unit`] = value.unit;
    })
  });
  
  return (
   <div>
      <LineChart
        width={1800}
        height={600}
        data={totalData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="at" minTickGap={200}/>
        <YAxis dataKey="flareTempValue" />
        <YAxis dataKey="casingPressureValue" />
        <YAxis dataKey="injValveOpenValue" />
        <Line type="monotone" dataKey="flareTempValue" stroke="#581845" dot={false}/>
        <Line type="monotone" dataKey="casingPressureValue" stroke="#C70039" dot={false}/>
        <Line type="monotone" dataKey="injValveOpenValue" stroke="#FF5733" dot={false}/>
        <Line type="monotone" dataKey="oilTempValue" stroke="#FFC300" dot={false}/>
        <Line type="monotone" dataKey="tubingPressureValue" stroke="#FFFC33" dot={false}/>
        <Line type="monotone" dataKey="waterTempValue" stroke="#D433FF" dot={false}/>  
        <Tooltip />
        <Legend />
      </LineChart>

   </div>
  );
};