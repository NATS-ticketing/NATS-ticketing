"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Divider } from "@nextui-org/react";

export default function StepsBar() {
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
    <div className="flex items-center w-full my-10">
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
      <p className="font-semibold">{text}</p>
    </div>
  );
}
