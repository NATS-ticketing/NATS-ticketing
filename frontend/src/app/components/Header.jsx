"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isSelect, setIsSelect] = useState("home");

  function handleClick(page) {
    setIsSelect(page);
  }

  return (
    <Navbar
      maxWidth="xl"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:text-amber-400",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-amber-400",
        ],
      }}
    >
      <NavbarBrand>
        <Link href="/">
          <Image alt="logo" src="/logo.png" width={200} height={200}></Image>
        </Link>
      </NavbarBrand>

      <NavbarContent className="flex gap-10" justify="center">
        <NavbarItem isActive={isSelect === "home"}>
          <Link href="/" onClick={() => handleClick("home")}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isSelect === "events"}>
          <Link href="/" onClick={() => handleClick("events")}>
            Events
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isSelect === "faq"}>
          <Link href="/" onClick={() => handleClick("faq")}>
            FAQ
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="flex" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Search by Event"
          size="sm"
          startContent={<CiSearch size={18} />}
          type="search"
        />
      </NavbarContent>
    </Navbar>
  );
}
