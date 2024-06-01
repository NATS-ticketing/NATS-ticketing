"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Select, SelectItem } from "@nextui-org/react";

export default function Ticket() {
  return (
    <div>
      <Header />
      <main className="bg-gray-100 flex py-20 px-20 grid grid-cols-5">
        <div className="col-span-3">
          <Introduction />
        </div>
        <div className="pt-20 col-span-2">
          <img src="/aespa-seat.png" alt="aespa-seat" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Introduction() {
  const seats = [
    { key: "VIP1 $6888", label: "VIP1 $6888" },
    { key: "VIP2 $4888", label: "VIP2 $4888" },
    { key: "VIP3 $2888", label: "VIP3 $2888" },
  ];

  return (
    <>
      <p className="text-2xl font-bold pb-8">
        2024 aespa LIVE TOUR - SYNK : PARALLEL LINE in TAIPEI 
      </p>
      <div>
        <div className="grid grid-cols-2 pb-6 items-center">
          <Info title="開始時間" content="2024/08/10 (六) 7:00PM" />
          <div>
            <span className="mr-6 text-gray-500 font-medium">票區</span>
            <Select
              label="選擇票區"
              className="w-2/3 bordered"
              variant="bordered"
              size="sm"
            >
              {seats.map((seat) => (
                <SelectItem key={seat.key}>{seat.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 pb-6 items-center">
          <Info
            title="活動地點"
            content="國立體育大學綜合體育館 (林口體育館)"
          />
          <Info title="剩餘數量" content="2" hint="text-red-500" />
        </div>
        <Info title="主辦單位" content="iMe TW" />
      </div>
    </>
  );
}

function Info({ title, content, hint }) {
  return (
    <div>
      <span className="mr-6 text-gray-500 font-medium">{title}</span>
      <span className={hint ? hint : ""}>{content}</span>
    </div>
  );
}
