import Month from './Components/Month';

import { months } from './data/months';

const Callendar = () => {
  return (
    <div className='app'>
      <h1>اليومية المدرسية 2025/2024</h1>
      <div className='callendar'>
        {months.map((month) => (
          <Month
            key={month.name}
            monthName={month.name}
            monthData={month.data}
            monthHolidays={month.holidays}
          />
        ))}
      </div>
    </div>
  );
};

export default Callendar;
