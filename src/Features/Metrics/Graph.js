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
        let timestamp = value.at;
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var formattedTime = hours + ':' + minutes.substr(-2);
        totalData.push({
          at: formattedTime,
          date
        })
      }
      totalData[index][`${value.metric}Value`] = value.value;
      totalData[index][`${value.metric}Unit`] = value.unit;
    })
  });

  totalData = totalData.sort((a, b) => new Date(a.date) - new Date(b.date));

  let yaxisDataKey = totalData[0] && totalData[0].flareTempValue ? 'flareTempValue' :
  totalData[0] && totalData[0].casingPressureValue ? 'casingPressureValue' :
  totalData[0] && totalData[0].injValveOpenValue ? 'injValveOpenValue' :
  totalData[0] && totalData[0].oilTempValue ? 'oilTempValue' :
  totalData[0] && totalData[0].tubingPressureValue ? 'tubingPressureValue' :
  totalData[0] && totalData[0].waterTempValue ? 'waterTempValue' : '';
  
  return (
   <div>
      <LineChart
        width={1800}
        height={500}
        data={totalData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="at" tickCount={2000}/>
        <YAxis dataKey={yaxisDataKey} tickCount={10}>
        </YAxis>
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