import { type ChangeEventHandler } from "react";

export default function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return <input type="date" value={value} onChange={onChange} />;
}
