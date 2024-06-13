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
import { FaBell } from "react-icons/fa";
import { requestTicketState, requestSnapUp } from "@/app/lib/natsClient";
import { subscribeTicketState } from "@/app/lib/wsClient";
import { useRouter } from "next/navigation";

export default function Ticket() {
  const [quantity, setQuantity] = useState(1);
  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [thisSession, setThisSession] = useState("");
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    async function fetchTicketState() {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await requestTicketState(1);
        setThisSession(response.session);
        setSeats(response.state.areas);
        const initialSeat = response.state.areas.find((seat) => seat.id === 1);
        if (initialSeat) {
          setTicketsLeft(initialSeat.empty);
          setSelectedArea(initialSeat.id);
          setSelectedAreaName(initialSeat.name);
          setPrice(initialSeat.price);
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
        <div className="flex items-center justify-center h-screen">
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
    const selectedArea = seats.find((seat) => seat.id === selectedValue);
    if (selectedArea) {
      setTicketsLeft(selectedArea.empty);
      setSelectedArea(selectedArea.id);
      setSelectedAreaName(selectedArea.name);
      setPrice(selectedArea.price);
    }
  };

  async function handleSubscribe() {
    const permisson = await Notification.requestPermission();
    console.log("permisson:", permisson);
    if (permisson === "granted") {
      setIsSubscribed(true);
      const subSession = thisSession;
      const subArea = selectedSeat.id;

      const response = await new Promise((resolve, reject) => {
        subscribeTicketState(subSession, subArea, (data) => {
          resolve(data);
        });
      });
      console.log("Notification res:", response);
      new Notification(
        `釋放票區通知: ${response.area_name} 有 ${response.empty} 個空位`
      );
      alert("已訂閱釋票通知");
    } else {
      alert("通知權限未授予，無法訂閱釋票通知");
    }
  }

  return (
    <div>
      <Header />
      <main className="flex grid grid-cols-5 gap-8 px-20 py-16 bg-gray-100">
        <div className="col-span-3">
          <Introduction
            ticketsLeft={ticketsLeft}
            seats={seats}
            selectedSeat={selectedSeat}
            onSeatChange={handleSeatChange}
          />

          {ticketsLeft > 0 ? (
            <>
              <TicketArea
                th1="票種"
                th2="金額(NT$)"
                th3="購買張數"
                td1={selectedAreaName}
                td2={price}
                td3={
                  <Select
                    label="選擇張數"
                    variant="bordered"
                    size="sm"
                    className="w-1/2"
                    defaultSelectedKeys="1"
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(Number(event.target.value));
                    }}
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
              <ConfirmArea
                thisSession={thisSession}
                selectedArea={selectedArea}
                selectedAreaName={selectedAreaName}
                quantity={quantity}
              />
            </>
          ) : (
            <TicketsSoldOut
              isSubscribed={isSubscribed}
              onSubscribe={handleSubscribe}
            />
          )}
        </div>
        <div className="col-span-2 pt-20">
          <img src="/aespa-seat.png" alt="aespa-seat" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ConfirmArea({
  thisSession,
  selectedArea,
  selectedAreaName,
  quantity,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!isSelected) {
      alert("請先同意服務條款與隱私權政策");
      return;
    }

    const response = await requestSnapUp(thisSession, selectedArea, quantity);
    if (response.status == "success") {
      localStorage.setItem(
        "orderDetails",
        JSON.stringify({
          order: response.order,
          sessionId: thisSession,
          areaId: selectedArea,
          areaName: selectedAreaName,
          price: response.price,
          seats: response.seats,
          seatStatus: response.seat_status,
        })
      );
      router.push("/order");
    } else if (response.status == "no_seat") {
      alert("沒票囉 (｡•́︿•̀｡) ");
      router.push("/");
    }
  }

  return (
    <div className="mt-12">
      <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
        <p>
          我已經閱讀並同意{" "}
          <span className="text-amber-600 hover:underline">服務條款</span> 與{" "}
          <span className="text-amber-600 hover:underline">隱私權政策</span>。
        </p>
      </Checkbox>
      <div className="flex justify-center w-full mt-10">
        <Button
          color="primary"
          size="lg"
          radius="sm"
          className="font-bold"
          onClick={handleClick}
        >
          確認張數
        </Button>
      </div>
    </div>
  );
}

function TicketsSoldOut({ isSubscribed, onSubscribe }) {
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
      <Button
        radius="none"
        size="lg"
        className="mt-10 font-bold bg-amber-400"
        onClick={onSubscribe}
      >
        {isSubscribed ? (
          <>
            已訂閱 <FaBell />
          </>
        ) : (
          "釋票通知訂閱"
        )}
      </Button>
    </div>
  );
}
