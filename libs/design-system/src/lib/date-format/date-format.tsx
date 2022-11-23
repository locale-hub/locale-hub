import { format } from 'date-fns';

export default function DateFormat({
  date
}: {
  date: string
}) {
  return <>
      { format(new Date(date), 'yyyy/MM/dd HH:mm') }
  </>;
}
