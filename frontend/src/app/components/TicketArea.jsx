"use client";
import { usePathname } from "next/navigation";
import StepsBar from "./StepsBar";

export default function TicketArea({
  th1,
  th2,
  th3,
  td1,
  td2,
  td3,
  orderNumber,
}) {
  const pathname = usePathname();

  return (
    <>
      <StepsBar />
      {pathname === "/order" && (
        <div className="pb-2">
          <span className="font-semibold text-red-500">
            訂單編號 <span>{orderNumber}</span>
          </span>
        </div>
      )}
      <table className="w-full pr-5 table-fixed">
        <thead className="w-full h-12 pr-5 bg-gray-300">
          <tr>
            <th>{th1}</th>
            <th>{th2}</th>
            <th>{th3}</th>
          </tr>
        </thead>
        <tbody className="w-full border-b-2 border-black">
          <tr className="h-28">
            <td className="font-semibold text-center align-middle">{td1}</td>
            <td className="font-semibold text-center align-middle">
              {td2 ? td2.toString() : ""}
            </td>
            <td className="font-semibold text-center align-middle">{td3}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
