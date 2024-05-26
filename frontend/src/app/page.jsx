import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main>
        <h1>Welcome to TicketBuzz</h1>
        <Button>Get Started</Button>
      </main>
    </NextUIProvider>
  );
}
