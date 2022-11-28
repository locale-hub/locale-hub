import React from 'react';

type DataEntry = {
  name: string,
  icon: React.ReactNode,
  link?: string,
  onClick?: () => void,
  type?: 'default' | 'danger'
};

const colors = {
  default: 'text-gray-900 dark:text-white',
  danger: 'text-warn'
};

const renderEntry = (entry: DataEntry, idx: number) => {
  const classes = `flex items-center p-2 text-base font-normal ${colors[entry.type ?? 'default']} rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700`;

  if (undefined !== entry.link) {
    return <a href={entry.link} key={idx} className={classes}>
      {entry.icon}
      <span className="ml-3">{entry.name}</span>
    </a>;
  }
  if (undefined !== entry.onClick) {
    return <a onClick={entry.onClick} key={idx} className={classes}>
      {entry.icon}
      <span className="ml-3">{entry.name}</span>
    </a>;
  }
  return null;
};

export default function Sidebar({
  data
}: {
  data: DataEntry[]
}) {
  return <aside className="w-full h-full" aria-label="Sidebar">
    <div className="overflow-y-auto py-4 px-3  h-full border-r border-slate-400/50">
      <ul className="space-y-2">
        { data.map(renderEntry) }
      </ul>
    </div>
  </aside>;
}
