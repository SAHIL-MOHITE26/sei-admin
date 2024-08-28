import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { useSpring, animated } from '@react-spring/web';
import { FaUsers, FaUserCircle, FaBriefcase, FaPen, FaExclamationTriangle, FaCalendarCheck, FaMoneyBillWave, FaFileInvoice } from 'react-icons/fa';

const stats = [
  { title: 'Employees', value: '1,250', color: 'bg-green-500', icon: <FaUsers /> },
  { title: 'Candidates', value: '250', color: 'bg-blue-500', icon: <FaUserCircle /> },
  { title: 'Jobs Applied', value: '5,000', color: 'bg-yellow-500', icon: <FaBriefcase /> },
  { title: 'Jobs Posted', value: '120', color: 'bg-purple-500', icon: <FaPen /> },
  { title: 'Incomplete Profiles', value: '20', color: 'bg-red-500', icon: <FaExclamationTriangle /> },
  { title: 'Accepted Candidates', value: '30', color: 'bg-pink-500', icon: <FaCalendarCheck /> },
];

const jobProfiles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Consultant']; // Example job profiles

const CardDataStats: React.FC = () => {
  const [income, setIncome] = useState('$25000');
  const [taxes, setTaxes] = useState('2000');
  const [companyName, setCompanyName] = useState('');
  const [selectedJobProfile, setSelectedJobProfile] = useState('');

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const animateNumber = (toValue: number) => {
    const props = useSpring({
      from: { number: 0 },
      to: { number: toValue },
      config: { duration: 1000 },
    });
    return props.number.to((n) => Math.floor(n).toLocaleString());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Smaller Cards */}
      <div className="lg:col-span-3 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Transition
            key={index}
            show={true}
            appear={true}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`rounded-lg border border-stroke py-3 px-4 shadow-default dark:border-strokedark dark:bg-boxdark ${stat.color}`}
              style={{
                height: '10rem', // Reduced height
                width: '17rem', // Reduced width
                borderRadius: '10px', // Slightly reduced border radius
              }}
            >
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="text-white text-3xl mt-2">
                  {stat.icon}
                </div>
                <hr className="my-2 w-3/4 border-white" /> {/* Line between icon and title */}
              </div>
              <div className="text-white text-lg font-bold text-center">{stat.title}</div>
              <div className="text-white text-2xl font-bold mt-2 text-center">
                <animated.span>{animateNumber(parseInt(stat.value.replace(/,/g, '')))}</animated.span>
              </div>
            </div>
          </Transition>
        ))}
      </div>

      {/* Big Card */}
      <div
        className="lg:col-span-1 rounded-lg border bg-black border-stroke py-4 px-6 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col"
        style={{
          height: '21rem', // Adjust as needed
          width: '18.5rem', // Adjust as needed
          borderRadius: '15px',
        }}
      >
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter Company Name"
          className="text-white text-2xl font-bold text-left mb-2 bg-transparent border-none focus:outline-none"
        />
        <div className="text-gray-400 text-sm mb-4">Please enter the company name</div>
        <hr className="my-1 border-white" /> {/* Added horizontal line */}
        <div className="flex flex-col mt-6">
          <div className="flex items-center text-white text-lg mb-2">
            <FaBriefcase className="text-2xl mr-2 text-blue-400" />
            <span className="ml-1">Job Profile</span>
            <select
              value={selectedJobProfile}
              onChange={(e) => setSelectedJobProfile(e.target.value)}
              className="ml-auto bg-black text-white border-none rounded py-1 px-2 focus:outline-none"
              style={{ width: '100px' }}
            >
              <option value="" disabled>Select</option>
              {jobProfiles.map((profile) => (
                <option key={profile} value={profile}>{profile}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center text-white text-lg mb-2">
            <FaMoneyBillWave className="text-2xl mr-2 text-green-500" />
            <span className="ml-1">Income</span>
            <input
              type="text"
              value={income}
              onChange={(e) => handleNumericInput(e, setIncome)}
              className="ml-auto bg-transparent border-none text-right text-white"
              style={{ width: '100px' }}
            />
          </div>
          
          
          <div className="flex items-center text-white text-lg mb-4">
            <FaFileInvoice className="text-2xl mr-2 text-yellow-300" />
            <span className="ml-1">Taxes</span>
            <input
              type="text"
              value={taxes}
              onChange={(e) => handleNumericInput(e, setTaxes)}
              className="ml-auto bg-transparent border-none text-right text-white"
              style={{ width: '100px' }}
            />
          </div>
        </div>
        <div className="text-center mt-auto">
          <button className="bg-blue-200 text-black py-2 px-4 rounded hover:bg-blue-600">Add Company</button>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
