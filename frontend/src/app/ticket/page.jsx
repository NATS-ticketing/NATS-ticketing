"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Select, SelectItem } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { useState } from "react";

export default function Ticket() {
  return (
    <div>
      <Header />
      <main className="bg-gray-100 flex py-20 px-20 grid grid-cols-5 gap-8">
        <div className="col-span-3">
          <Introduction />
          <StepsBar />
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
    <div className="mb-10">
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
    </div>
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

function StepsBar() {
  const [step, setStep] = useState(1);

  function handleClick(num) {
    setStep(num);
  }

  return (
    <div className="flex w-full items-center pr-5">
      <Step order="1" text="選擇票種" step={step} handleClick={handleClick} />
      <Divider className="w-2/4 bg-black h-0.5" />
      <Step order="2" text="取票繳費" step={step} handleClick={handleClick} />
    </div>
  );
}

function Step({ order, text, step, handleClick }) {
  return (
    <div
      className={`flex ${
        step == order ? "bg-amber-400" : "bg-gray-400"
      } p-2 rounded-3xl w-1/4 border-2 border-black items-center gap-3`}
      onClick={() => handleClick(order)}
    >
      <div className="bg-white rounded-full rounded-full px-3 py-1 font-medium">
        {order}
      </div>
      <p className="font-medium">{text}</p>
    </div>
  );
}
