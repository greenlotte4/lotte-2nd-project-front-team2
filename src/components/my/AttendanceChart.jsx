import { useQuery } from '@tanstack/react-query';
import { reverse } from 'lodash';
import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const WorkTimeline = ({data}) => {

  console.log('차트 컴포넌트 내부 프랍 '+JSON.stringify(data));
  const work = data.slice().reverse()

  const fixDate = '2024-11-18T'; 
  console.log('차트 리버스 데이터 '+JSON.stringify(work))

  const chartData = work.map((entry) => ({
    x: entry.date,
    y: [
      new Date(`${fixDate + entry.checkInTime}`).getTime(),
      new Date(`${fixDate + entry.checkOutTime}`).getTime()
    ],
    fillColor: `#818CF8` // 데이터마다 같은 색상 적용
  }));


  const options = {
    chart: {
      zoom: {
        enabled: false
      },
      pan: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        rangeBarGroupRows: true
      }
    },
    xaxis: {
      type: 'datetime',
      min: new Date('2024-11-18T08:00:00').getTime(), // X축 시작 시간 (08:00)
      max: new Date('2024-11-18T23:00:00').getTime(), // X축 끝 시간 (19:00)
      labels: {
        format: 'HH:mm', // 시간만 표시
        datetimeUTC: false // 현지 시간 사용
      },
      tickAmount: 11 // 시간대 간격 (08:00, 09:00, ...)
    },
    fill: {
      type: 'solid'
    },
    legend: {
      show: true, 
      position: 'top',
      horizontalAlign: 'left'
    },
  };

  return (
    <div>
      <Chart
        options={options}
        series={[
          {
            data: chartData
          }
        ]}
        type="rangeBar"
        height={300}
      />
    </div>
  );
};

export default WorkTimeline;