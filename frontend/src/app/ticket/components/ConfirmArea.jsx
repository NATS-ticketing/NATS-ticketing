import { requestSnapUp } from "@/app/lib/wsClient";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox } from "@nextui-org/react";
import Swal from "sweetalert2";

export default function ConfirmArea({
  thisSession,
  selectedArea,
  selectedAreaName,
  quantity,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!isSelected) {
      Swal.fire({
        title: "Sorry!",
        text: "請先同意服務條款與隱私權政策",
        icon: "warning",
      });
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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "沒票囉 (｡•́︿•̀｡) ",
      });
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
