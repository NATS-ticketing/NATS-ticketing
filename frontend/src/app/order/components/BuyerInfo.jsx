import { Input, DateInput } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { FaRegUser } from "react-icons/fa";

export default function BuyerInfo() {
  return (
    <div className="grid grid-cols-10 mb-5 bg-gray-300 mt-14 h-44">
      <div className="flex items-center justify-center h-full col-span-1 bg-amber-400">
        <FaRegUser size={30} />
      </div>
      <div className="col-span-9 p-5">
        <p className="mb-4 text-lg font-semibold">訂購人資料</p>
        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              label="姓名"
              labelPlacement="outside-left"
              isRequired
              required
              name="name"
            />
            <Input
              type="text"
              label="手機"
              labelPlacement="outside-left"
              isRequired
              required
              name="phone"
            />
          </div>
          <div className="flex flex-col w-3/5 gap-3">
            <DateInput
              isRequired
              label="出生年月日"
              placeholderValue={new CalendarDate(1995, 11, 6)}
              labelPlacement="outside-left"
              required
              name="birthday"
            />
            <div className="flex items-center ">
              <label className="w-1/4 text-sm">
                電子信箱<span className="text-red-500"> *</span>
              </label>
              <Input
                type="email"
                labelPlacement="inside"
                isRequired
                className="w-full"
                required
                name="email"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
