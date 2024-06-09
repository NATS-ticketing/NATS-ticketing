"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectItem,
  Button,
  Checkbox,
  CircularProgress,
} from "@nextui-org/react";
import Introduction from "@/app/components/Introduction";
import TicketArea from "@/app/components/TicketArea";
import Link from "next/link";

const ticketsLeft = 2;

export default function Ticket() {
  const [quantity, setQuantity] = useState("1");
  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchTicketState() {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await fetch(`/api/ticketState?session=1`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setSeats(data.state.state.areas);
        const initialSeat = data.state.state.areas.find(
          (seat) => seat.id === 1
        );
        if (initialSeat) {
          setTicketsLeft(initialSeat.empty);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setHasError(true);
      }
    }

    fetchTicketState();
  }, []);

  if (isLoading || hasError) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <CircularProgress size="lg" aria-label="Loading..." />
        </div>
        <Footer />
      </div>
    );
  }

  const handleSeatChange = (selectedKeys) => {
    const selectedKey = Array.from(selectedKeys)[0];
    const selectedValue = parseInt(selectedKey, 10);
    setSelectedSeat(selectedValue);
    const selectedSeat = seats.find((seat) => seat.id === selectedValue);
    if (selectedSeat) {
      setTicketsLeft(selectedSeat.empty);
    }
  };

  return (
    <div>
      <Header />
      <main className="flex grid grid-cols-5 gap-8 px-20 py-16 bg-gray-100">
        <div className="col-span-3">
          <Introduction
            ticketsLeft={ticketsLeft}
            seats={seats}
            selectedSeat={selectedSeat}
            handleSeatChange={handleSeatChange}
          />

          {ticketsLeft > 0 ? (
            <TicketArea
              th1="票種"
              th2="金額(NT$)"
              th3="購買張數"
              td1="VIP1"
              td2="6888"
              td3={
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
              }
            />
          ) : (
            <TicketsSoldOut />
          )}
          <ConfirmArea />
        </div>
        <div className="col-span-2 pt-20">
          <img src="/aespa-seat.png" alt="aespa-seat" />
        </div>
      </main>
      <Footer />
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
        <Link href="/order">
          {/* <Button radius="none" size="lg" className="font-bold bg-amber-400">
            確認張數
          </Button> */}
          <Button color="primary" size="lg" radius="sm" className="font-bold">
            確認張數
          </Button>
        </Link>
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
