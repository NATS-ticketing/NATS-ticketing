"use client";
import { Select, SelectItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function Introduction({ ticketsLeft }) {
  const pathname = usePathname();
  const seats = [
    { key: "VIP1 $6888", label: "VIP1 $6888" },
    { key: "VIP2 $4888", label: "VIP2 $4888" },
    { key: "VIP3 $2888", label: "VIP3 $2888" },
  ];

  return (
    <div>
      <p className="pb-8 text-2xl font-bold">
        2024 aespa LIVE TOUR - SYNK : PARALLEL LINE in TAIPEI 
      </p>
      <div>
        <div className="grid items-center grid-cols-2 pb-6">
          <Info title="開始時間" content="2024/08/10 (六) 7:00PM" />
          {pathname == "/ticket" && (
            <div>
              <span className="mr-6 font-medium text-gray-500">票區</span>
              <Select
                label="選擇票區"
                className="w-2/3 bordered"
                variant="bordered"
                size="sm"
                defaultSelectedKeys={seats.length && [seats[0].key]}
              >
                {seats.map((seat) => (
                  <SelectItem key={seat.key}>{seat.label}</SelectItem>
                ))}
              </Select>
            </div>
          )}
        </div>
        <div className="grid items-center grid-cols-2 pb-6">
          <Info title="活動地點" content="國立體育大學綜合體育館" />
          {pathname == "/ticket" && (
            <Info
              title="剩餘數量"
              content={ticketsLeft}
              hint="text-red-600 font-bold"
            />
          )}
        </div>
        <Info title="主辦單位" content="iMe TW" />
      </div>
    </div>
  );
}

function Info({ title, content, hint }) {
  return (
    <div>
      <span className="mr-6 font-medium text-gray-500">{title}</span>
      <span className={hint ? hint : ""}>{content}</span>
    </div>
  );
}
