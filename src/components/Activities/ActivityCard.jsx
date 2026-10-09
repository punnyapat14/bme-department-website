import React from 'react';
import { Link } from 'react-router-dom';

export default function ActivityCard({ title, description, to, colorFrom, colorTo, icon }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-100"
    >
      <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colorFrom} ${colorTo} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>

      <div>
        <h4 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-purple-700">
          {title}
        </h4>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center text-sm font-semibold text-purple-600 transition-all group-hover:translate-x-1">
        ดูรายละเอียด
        <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}