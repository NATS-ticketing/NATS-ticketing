import { Button } from "@nextui-org/react";
import { FaBell } from "react-icons/fa";

export default function TicketsSoldOut({ isSubscribed, onSubscribe }) {
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
