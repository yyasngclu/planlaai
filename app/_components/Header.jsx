"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={"/investelling.png"} alt="logo" width={40} height={25} />
        <Link href="/">
          <span
            className="text-red-800 font-bold text-3xl cursor-pointer"
            style={{ marginLeft: "5px" }}
          >
            Investelling
          </span>
        </Link>
        <span
          className="text-black-800 italic text-sm"
          style={{ marginLeft: "20px", marginTop: "5px" }}
        >
          finans asistanınız..
        </span>
      </div>

      <div className="flex gap-3 items-center">
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <Button className="rounded-full">
            {isSignedIn ? "Gösterge Paneli" : "Giriş Yap"}
          </Button>
        </Link>
        {isSignedIn && <UserButton />}
      </div>
    </div>
  );
}

export default Header;
