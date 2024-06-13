"use client";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Introduction from "@/app/components/Introduction";
import TicketArea from "@/app/components/TicketArea";
import { FaRegUser } from "react-icons/fa";
import { Input, DateInput, Button, RadioGroup, Radio } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { requestConfirm, requestCancel } from "@/app/lib/wsClient";
import { useRouter } from "next/navigation";
import Swal, { SweetAlertIcon } from "sweetalert2";

export default function Order() {
  const [order, setOrder] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [areaName, setAreaName] = useState(null);
  const [price, setPrice] = useState(null);
  const [seats, setSeats] = useState(null);
  const [seatStatus, setSeatStatus] = useState(null);
  const router = useRouter();

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

      // clean local storage
      localStorage.removeItem("orderDetails");
    } else {
      console.error("No order details found in localStorage");
    }
  }, []);

  async function confirmOrder() {
    const response = await requestConfirm(sessionId, areaId, order, seats);
    if (response.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "訂購成功!๛ก(ｰ̀ωｰ́ก)",
      });
      router.push("/");
    } else if (response.status == "no_seat") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "訂購失敗  (⑉･̆༥･̆⑉)  ",
      });
      router.push("/");
    }
  }

  async function cancelOrder() {
    const response = await requestCancel(sessionId, areaId, order, seats);
    if (response.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "取消訂單成功!(⑉･̆༥･̆⑉)",
      });
      router.push("/");
    } else {
      console.log("取消訂單失敗");
    }
  }

  function handleCancel() {
    cancelOrder();
  }

  function handleSubmit(event) {
    event.preventDefault();
    confirmOrder();
  }

  // 防止按下 Enter 後 form 會自動 submit
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  return (
    <div className="bg-gray-100 ">
      <Header />
      <main className="flex flex-col w-3/5 px-5 pt-5 mx-auto my-10">
        <Introduction />
        <TicketArea
          orderNumber={order ? order.substring(0, 8) : ""}
          th1="票種"
          th2="座位"
          th3="金額(NT$)"
          td1={areaName}
          td2={seats}
          td3={price && seats ? price * seats.split(",").length : 0}
        />
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <BuyerInfo />
          <OrderInfo title="付款方式" option="7-11 ibon付款">
            至全台 7-11 店內 ibon 機台自行列印付款繳費單，再進行付款。
          </OrderInfo>
          <OrderInfo title="取票方式" option="7-11 ibon取票">
            至全台 7-11 店內 ibon 機台操作付款後，即可取票。
          </OrderInfo>
          <div className="flex justify-center my-10 gap-14">
            <Button
              size="lg"
              className="font-bold"
              radius="sm"
              onClick={handleCancel}
            >
              取消訂單
            </Button>
            <Button
              color="primary"
              size="lg"
              className="font-bold"
              radius="sm"
              type="submit"
            >
              完成訂單
            </Button>
          </div>
        </form>
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
