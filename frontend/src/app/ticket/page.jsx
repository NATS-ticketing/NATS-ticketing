"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Introduction from "@/app/components/Introduction";
import TicketArea from "@/app/components/TicketArea";
import ConfirmArea from "@/app/ticket/components/ConfirmArea";
import TicketsSoldOut from "@/app/ticket/components/TicketsSoldOut";
import { requestTicketState, subscribeTicketState } from "@/app/lib/wsClient";
import React, { useState, useEffect } from "react";
import { Select, SelectItem, CircularProgress } from "@nextui-org/react";
import Swal from "sweetalert2";

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
      const subArea = selectedSeat.id || 1;

      const response = await new Promise((resolve, reject) => {
        subscribeTicketState(subSession, subArea, (data) => {
          resolve(data);
        });
      });
      console.log("Notification res:", response);
      new Notification(
        `釋放票區通知: ${response.area_name} 有 ${response.empty} 個空位`
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "Sorry!",
        text: "通知權限未授予，無法訂閱釋票通知!",
      });
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
