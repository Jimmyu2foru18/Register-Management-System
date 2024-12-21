import React from 'react';
import { useForm } from 'react-hook-form';

interface DateRangeProps {
  onSubmit: (data: { startDate: string; endDate: string }) => void;
  defaultValues?: {
    startDate: string;
    endDate: string;
  };
}

export const DateRangeSelector: React.FC<DateRangeProps> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: defaultValues || {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          {...register('startDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          {...register('endDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Apply
      </button>
    </form>
  );
}; 