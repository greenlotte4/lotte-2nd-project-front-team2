import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/components/home/customCalendar.css';

const HomeCalendar = () => {
    const [value, onChange] = useState(new Date());

    return (
        <>
            <Calendar onChange={onChange} value={value}
            formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
            calendarType="gregory" // 일요일 부터 시작
            next2Label={null} // +1년 & +10년 이동 버튼 숨기기
            prev2Label={null}
            // locale="en"
            minDetail="year"
            />
        </>
    );
};

export default HomeCalendar;
