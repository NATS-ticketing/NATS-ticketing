"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Introduction from "@/app/components/Introduction";
import TicketArea from "@/app/components/TicketArea";
import BuyerInfo from "@/app/order/components/BuyerInfo";
import OrderInfo from "@/app/order/components/OrderInfo";
import { requestConfirm, requestCancel } from "@/app/lib/wsClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";

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
      setSeats(orderDetails.seats);
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
          td3={price && seats ? price * seats.length : 0}
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
