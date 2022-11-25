
export default function ProgressBar({
  fill
}: {
  fill: number
}) {
  return <div className="inline-block w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div className={`bg-green h-2.5 rounded-full`} style={{ width: `${fill}%` }} />
  </div>;
}