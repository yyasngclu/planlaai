import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Genel Bakış",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Hedeflerim / Bütçelerim",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Gelirler",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      id: 4,
      name: "Giderler",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 5,
      name: "AI Tavsiyeleri",
      icon: ShieldCheck,
      path: "/dashboard/ai-advice",
    },
    {
      id: 6,
      name: "Hesabım / Yükselt",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    },
  ];
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);
  return (
    <div className="h-screen p-5 border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src={"/planlaai.png"} alt="logo" width={40} height={25} />
        <Link href="/">
          <span
            className="text-red-800  font-bold text-3xl"
            style={{ marginLeft: "5px" }}
          >
            PlanlaAI
          </span>
        </Link>
      </div>
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center
                    text-black-500 font-medium
                    mb-2
                    p-4 cursor-pointer rounded-full
                    hover:text-red-800 hover:bg-red-100
                    ${path == menu.path && "text-red-800 bg-red-100"}
                    `}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div
        className="fixed bottom-10 p-5 flex gap-2
            items-center"
      >
        <UserButton />
        Profil
      </div>
    </div>
  );
}

export default SideNav;
