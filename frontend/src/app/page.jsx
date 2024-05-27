import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Header from "@/app/components/Header";

export default function Home() {
  return (
    <NextUIProvider>
      <Header />
      <main className="h-screen bg-slate-100">
        <h1>Welcome to TicketBuzz</h1>
        <Button>Get Started</Button>
      </main>
    </NextUIProvider>
  );
}
