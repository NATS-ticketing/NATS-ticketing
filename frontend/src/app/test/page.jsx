"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import React, { useState, useEffect } from "react";


import { requestTicketState } from "@/app/lib/natsClient";


export default function Test() {
  const [state, setState] = useState("");

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await requestTicketState(2);
      setState(JSON.stringify(response));
      // ...
    }
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 ">
      <Header />
      <main className="flex flex-col w-3/5 px-5 pt-5 mx-auto my-10">
        <p>{state}</p>
      </main>
      <Footer />
    </div>
  );
}
