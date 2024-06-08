"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import React, { useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const ticketsLeft = 2;

export default function Ticket() {
  return (
    <div>
      <Header />
      <main className="flex grid grid-cols-5 gap-8 px-20 py-16 bg-gray-100">
        <div className="col-span-3">
          <Introduction />

          {ticketsLeft > 0 ? <TicketArea /> : <TicketsSoldOut />}
        </div>
        <div className="col-span-2 pt-20">
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
      <p className="pb-8 text-2xl font-bold">
        2024 aespa LIVE TOUR - SYNK : PARALLEL LINE in TAIPEI 
      </p>
      <div>
        <div className="grid items-center grid-cols-2 pb-6">
          <Info title="開始時間" content="2024/08/10 (六) 7:00PM" />
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
        </div>
        <div className="grid items-center grid-cols-2 pb-6">
          <Info title="活動地點" content="國立體育大學綜合體育館" />
          <Info
            title="剩餘數量"
            content={ticketsLeft}
            hint="text-red-600 font-bold"
          />
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

function TicketArea() {
  const [quantity, setQuantity] = useState("1");

  return (
    <>
      <StepsBar />
      <table className="w-full pr-5 mt-12 table-fixed">
        <thead className="w-full h-12 pr-5 bg-gray-300">
          <tr>
            <th>票種</th>
            <th>金額(NT$)</th>
            <th>購買張數</th>
          </tr>
        </thead>
        <tbody className="w-full border-b-2 border-black">
          <tr className="h-28">
            <td className="font-medium text-center align-middle">VIP1</td>
            <td className="font-medium text-center align-middle">6888</td>
            <td className="font-medium text-center align-middle">
              <Select
                label="選擇張數"
                variant="bordered"
                size="sm"
                className="w-1/2"
                defaultSelectedKeys="1"
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
      <ConfirmArea />
    </>
  );
}

function StepsBar() {
  const pathname = usePathname();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (pathname === "/ticket") {
      setStep(1);
    } else if (pathname === "/order") {
      setStep(2);
    }
  });

  return (
    <div className="flex items-center w-full">
      <Step order="1" text="選擇票種" step={step} />
      <Divider className="w-2/4 bg-black h-0.5" />
      <Step order="2" text="取票繳費" step={step} />
    </div>
  );
}

function Step({ order, text, step }) {
  return (
    <div
      className={`flex ${
        step == order ? "bg-amber-400" : "bg-gray-300"
      } p-2 rounded-3xl w-1/4 border-2 border-black items-center gap-3`}
    >
      <div className="px-3 py-1 font-medium bg-white rounded-full">{order}</div>
      <p className="font-medium">{text}</p>
    </div>
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
      <div className="flex justify-center w-full mt-10">
        <Button radius="none" size="lg" className="font-bold bg-amber-400">
          確認張數
        </Button>
      </div>
    </div>
  );
}

function TicketsSoldOut() {
  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex flex-col items-center justify-center w-9/12 h-48 space-y-2 bg-gray-300">
        <p className="font-bold">您選擇的票區目前已售完，請選擇其他票區。</p>
        <p className="font-bold">
          您可以選擇訂閱該區的釋票通知，若有釋票，系統將會通知您。
        </p>
        <p className="font-bold text-red-600">
          * 釋票通知只會通知您目前所選的票區
        </p>
      </div>
      <Button radius="none" size="lg" className="mt-10 font-bold bg-amber-400">
        釋票通知訂閱
      </Button>
    </div>
  );
}
