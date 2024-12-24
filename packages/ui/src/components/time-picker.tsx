"use client";

import React, { useState } from "react";

const TimePicker = ({
  selectedHour,
  selectedMinute,
  setSelectedHour,
  setSelectedMinute,
}: {
  selectedHour: string;
  selectedMinute: string;
  setSelectedHour: (hour: string) => void;
  setSelectedMinute: (minute: string) => void;
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  return (
    <div className='relative inline-block'>
      {/* Time Input Box */}
      <div
        className='flex items-center bg-neutral-700 hover:bg-neutral-900 border-none rounded-md px-4 py-2 cursor-pointer text-neutral-300'
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <span>{`${selectedHour}:${selectedMinute}`}</span>
        <span className='ml-2 text-neutral-400'>IST</span>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className='absolute mt-2 flex bg-neutral-900 rounded-lg shadow-lg'>
          {/* Hours Dropdown */}
          <div className='flex flex-col overflow-y-auto max-h-40'>
            {hours.map((hour) => (
              <div
                key={hour}
                className={`px-4 py-2 hover:bg-neutral-700 cursor-pointer ${
                  hour === selectedHour
                    ? "bg-green-500 text-white"
                    : "text-neutral-300"
                }`}
                onClick={() => {
                  setSelectedHour(hour);
                  setDropdownOpen(false);
                }}
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Minutes Dropdown */}
          <div className='flex flex-col overflow-y-auto max-h-40 border-l border-neutral-700'>
            {minutes.map((minute) => (
              <div
                key={minute}
                className={`px-4 py-2 hover:bg-neutral-700 cursor-pointer ${
                  minute === selectedMinute
                    ? "bg-green-500 text-white"
                    : "text-neutral-300"
                }`}
                onClick={() => {
                  setSelectedMinute(minute);
                  setDropdownOpen(false);
                }}
              >
                {minute}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { TimePicker };
