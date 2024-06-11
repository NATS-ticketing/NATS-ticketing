"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Introduction from "@/app/components/Introduction";
import TicketArea from "@/app/components/TicketArea";
import { FaRegUser } from "react-icons/fa";
import { Input, DateInput, Button, RadioGroup, Radio } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";

export default function Order() {
  const [order, setOrder] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [areaName, setAreaName] = useState(null);
  const [price, setPrice] = useState(null);
  const [seats, setSeats] = useState(null);
  const [seatStatus, setSeatStatus] = useState(null);

  useEffect(() => {
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    if (orderDetails) {
      setOrder(orderDetails.order);
      setSessionId(orderDetails.sessionId);
      setAreaId(orderDetails.areaId);
      setAreaName(orderDetails.areaName);
      setPrice(orderDetails.price);
      setSeats(orderDetails.seats.toString());
      setSeatStatus(orderDetails.seatStatus);
    } else {
      console.error("No order details found in localStorage");
    }
  }, []);

  return (
    <div className="bg-gray-100 ">
      <Header />
      <main className="flex flex-col w-3/5 px-5 pt-5 mx-auto my-10">
        <Introduction />
        <TicketArea
          th1="票種"
          th2="座位"
          th3="金額(NT$)"
          td1={areaName}
          td2={seats}
          td3={price}
        />
        <BuyerInfo />
        <OrderInfo title="付款方式" option="7-11 ibon付款">
          至全台 7-11 店內 ibon 機台自行列印付款繳費單，再進行付款。
        </OrderInfo>
        <OrderInfo title="取票方式" option="7-11 ibon取票">
          至全台 7-11 店內 ibon 機台操作付款後，即可取票。
        </OrderInfo>
        <div className="flex justify-center my-10 gap-14">
          <Button size="lg" className="font-bold" radius="sm">
            取消訂單
          </Button>
          <Button color="primary" size="lg" className="font-bold" radius="sm">
            完成訂單
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function BuyerInfo() {
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
            />
            <Input
              type="text"
              label="手機"
              labelPlacement="outside-left"
              isRequired
            />
          </div>
          <div className="flex flex-col w-3/5 gap-3">
            <DateInput
              isRequired
              label="出生年月日"
              placeholderValue={new CalendarDate(1995, 11, 6)}
              labelPlacement="outside-left"
            />
            <div className="flex items-center ">
              <label className="w-1/4 text-sm">
                電子信箱<span className="text-red-500"> *</span>
              </label>
              <Input
                type="text"
                labelPlacement="inside"
                isRequired
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderInfo({ title, option, children }) {
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
