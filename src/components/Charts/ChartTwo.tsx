import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa'; // Import the calendar icon

// Sample data for upcoming payments
const upcomingPayments = [
  { title: 'Subscription', amount: '$500', date: '2024-09-01' },
  { title: 'Software License', amount: '$300', date: '2024-09-10' },
  { title: 'Hosting Fee', amount: '$100', date: '2024-09-15' },
];

const UpcomingPaymentsCard: React.FC = () => {
  return (
    <div
      className="rounded-lg border border-stroke bg-white py-4 px-5 shadow-default flex flex-col  dark:border-strokedark dark:bg-boxdark"
      style={{
        height: '17rem',
        width: '18rem',
        borderRadius: '15px',
        marginLeft: "87px",
      }}
    >
      <div className="text-black text-2xl font-bold text-left mb-6">Upcoming Payments</div>
      <div className="flex flex-col text-gray-900 mt-6 mb-4">
        {upcomingPayments.map((payment, index) => (
          <div key={index} className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FaCalendarAlt className="text-2xl mr-2 text-gray-600" />
              <span>{payment.title}</span>
            </div>
            <span>{payment.amount}</span>
          </div>
        ))}
      </div>
      <div className="text-center mt-auto">
        <a href="/more-info" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 inline-block">
          See More
        </a>
      </div>
    </div>
  );
};

export default UpcomingPaymentsCard;
