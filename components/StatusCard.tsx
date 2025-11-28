import React from 'react';

interface StatusCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-[#c6c6c6] border-4 border-b-4 border-r-4 border-white border-b-[#555] border-r-[#555] p-2 flex flex-col items-center min-w-[100px]">
      <div className="text-[#3f3f3f] font-bold text-lg mb-1">{label}</div>
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-3xl text-black font-pixel">{value}</div>
      </div>
    </div>
  );
};