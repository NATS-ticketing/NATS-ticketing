"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

const ticketsLeft = 10;

export default function Ticket() {
  return (
    <div>
      <Header />
      <main className="bg-gray-100 flex py-16 px-20 grid grid-cols-5 gap-8">
        <div className="col-span-3 pr-5">
          <Introduction />
          <StepsBar />
          <TicketTable />
          <ConfirmArea />
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
          <Info title="活動地點" content="國立體育大學綜合體育館" />
          <Info title="剩餘數量" content={ticketsLeft} hint="text-red-500" />
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
    <div className="flex w-full items-center">
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
        step == order ? "bg-amber-400" : "bg-gray-300"
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

function TicketTable() {
  const [quantity, setQuantity] = useState("1");

  return (
    <table className="w-full table-fixed mt-12 pr-5">
      <thead className="w-full h-12 bg-gray-300 pr-5">
        <tr>
          <th>票種</th>
          <th>金額(NT$)</th>
          <th>購買張數</th>
        </tr>
      </thead>
      <tbody className="w-full border-b-2 border-black">
        <tr className="h-28">
          <td className="text-center align-middle font-medium">VIP1</td>
          <td className="text-center align-middle font-medium">6888</td>
          <td className="text-center align-middle font-medium">
            <Select
              label="選擇張數"
              variant="bordered"
              size="sm"
              className="w-1/2"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            >
              {Array.from(
                { length: Math.min(ticketsLeft, 4) },
                (_, i) => i + 1
              ).map((num) => (
                <SelectItem key={num}>{String(num)}</SelectItem>
              ))}
            </Select>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function ConfirmArea() {
  return (
    <div className="mt-12">
      <Checkbox>
        <p>
          我已經閱讀並同意{" "}
          <span className="text-amber-600 hover:underline">服務條款</span> 與{" "}
          <span className="text-amber-600 hover:underline">隱私權政策</span>。
        </p>
      </Checkbox>
      <div className="flex w-full justify-center mt-10">
        <Button radius="none" size="lg" className="bg-amber-400 font-bold">
          確認張數
        </Button>
      </div>
    </div>
  );
}
