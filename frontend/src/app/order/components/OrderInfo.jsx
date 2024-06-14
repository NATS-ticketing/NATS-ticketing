import { RadioGroup, Radio } from "@nextui-org/react";

export default function OrderInfo({ title, option, children }) {
  return (
    <div className="my-5">
      <span className="font-semibold">{title}</span>
      <div className="h-24 p-5 my-2 bg-gray-300">
        <RadioGroup defaultValue={option} color="warning">
          <Radio value={option} className="font-semibold">
            {option}
          </Radio>
          <p className="px-7">
            {children}
            <span className="text-red-500">每筆取票手續費30元。</span>
          </p>
        </RadioGroup>
      </div>
    </div>
  );
}
