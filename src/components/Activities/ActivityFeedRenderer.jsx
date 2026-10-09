import React from 'react';

export default function ActivityFeedRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed">
        <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <p className="text-sm font-medium">ยังไม่มีเนื้อหากิจกรรมในขณะนี้</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'header':
            return (
              <h2 key={index} className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-6 mb-2 border-b border-slate-100 pb-3">
                {block.content}
              </h2>
            );
          
          case 'subheader':
            return (
              <h3 key={index} className="text-xl font-bold text-purple-700 mt-4">
                {block.content}
              </h3>
            );
          
          case 'paragraph':
            return (
              <p key={index} className="text-slate-600 leading-loose whitespace-pre-wrap">
                {block.content}
              </p>
            );
          
          case 'image':
            return (
              <figure key={index} className="my-6">
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                  <img src={block.url} alt={block.caption || 'Activity image'} className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-700" />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-sm font-medium text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          
          case 'link':
            return (
              <div key={index} className="my-2">
                <a href={block.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-purple-600 hover:text-white hover:bg-purple-600 bg-purple-50 px-4 py-2.5 rounded-xl font-bold transition-all border border-purple-100 break-words">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  {block.content || 'คลิกเพื่อดูรายละเอียดเพิ่มเติม'}
                </a>
              </div>
            );

          case 'embed':
            return (
              <div key={index} className="my-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 relative pt-[56.25%]">
                <iframe src={block.url} className="absolute top-0 left-0 w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}