import React from 'react';

export default function Card({
  children,
  className,
  image,
  title
}: {
  children?: React.ReactNode,
  className?: string,
  image?: string,
  title?: string
}) {
  return <div className={`${className} bg-white border border-gray-200 rounded-lg shadow-md dark:bg-zinc-800 dark:border-gray-700`}>
    { image && <img className="rounded-t-lg w-full h-[200px] p-4 border-b border-slate-400/50"
        src={image} alt={`${title}'s image`}
    />}
    <div className="p-5">
      { title && <h5 className="mb-2 text-xl font-bold tracking-tight text-primary mb-0">
          { title }
        </h5>
      }
      { children && <div className="font-normal text-gray-700 dark:text-gray-400 mt-2">
          {children}
        </div>
      }
    </div>
  </div>;
}
