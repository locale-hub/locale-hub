export default function Table({
  className,
  heads,
  entries,
}: {
  className?: string;
  heads: { key: string; label: string; className?: string }[];
  entries: { [_: string]: any }[];
}) {
  return (
    <div
      className={`${className} rounded-md border border-slate-400/50 relative mt-8`}
    >
      <table className="w-full text-sm text-left rounded-lg text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {heads.map((head, idx) => (
              <th
                scope="col"
                key={idx}
                className={`py-3 px-6 ${head.className}`}
              >
                {head.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr
              key={idx}
              className="bg-white border-b border-slate-400/50 dark:bg-zinc-800 dark:border-gray-700"
            >
              {heads.map((head, idx2) => (
                <th
                  key={idx2}
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {entry[head.key]}
                </th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
