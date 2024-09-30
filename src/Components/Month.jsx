/* eslint-disable react/prop-types */
const Month = ({ monthName, monthData, monthHolidays }) => {
  return (
    <div className='month-card'>
      <div className='month-header'>
        <div className='month-name'>
          <div>{monthName}</div>
        </div>
        <div className='week-days'>
          <div>إ</div>
          <div>ث</div>
          <div>أ</div>
          <div>خ</div>
          <div>ج</div>
          <div>س</div>
          <div>أ</div>
        </div>
      </div>

      <div className='month-days'>
        {monthData.map((row, index) => (
          <div key={index}>
            {row.map((cell) => (
              <div
                className={`${
                  +cell === 0
                    ? 'hidden'
                    : monthHolidays.includes(cell)
                    ? 'holiday'
                    : ''
                }`}
                key={index + cell + Date.now()}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Month;
