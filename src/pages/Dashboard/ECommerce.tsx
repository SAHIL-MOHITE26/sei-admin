import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import UpcomingPaymentsCard from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import TableOne from '../../components/Tables/TableOne';

const ECommerce: React.FC = () => {
  return (
    <>
      <div >
        <CardDataStats/>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <UpcomingPaymentsCard />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
