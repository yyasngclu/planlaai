"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function CreateIncomes({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [budgetId, setBudgetId] = useState();

  const { user } = useUser();
  const [budgetOptions, setBudgetOptions] = useState([]);
  React.useEffect(() => {
    async function fetchBudgets() {
      if (!user) return;
      const response = await fetch(
        `/api/budgets?createdBy=${user?.primaryEmailAddress?.emailAddress}`
      );
      const result = await response.json();
      if (result.success) setBudgetOptions(result.data);
    }
    fetchBudgets();
  }, [user]);

  /**
   * Used to Create New Budget
   */
  const onCreateIncomes = async () => {
    try {
      const response = await fetch("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcon,
          budgetId: budgetId || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        refreshData();
        setName("");
        setAmount("");
        setBudgetId("");
        toast("Yeni Gelir Kaynağı Oluşturuldu!");
        document.querySelector('[data-state="open"]')?.click(); // modalı kapatmak için
      }
    } catch (error) {
      console.error("Error creating income:", error);
      toast("Hata oluştu!");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Yeni Gelir Kaynağı Ekle</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Gelir Kaynağı Ekle</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Kaynak Adı</h2>
                  <Input
                    placeholder="örn. Youtube"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Aylık Tutar</h2>
                  <Input
                    type="number"
                    placeholder="örn. 5000₺"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="mt-2">
                    <h2 className="text-black font-medium my-1">Bütçe Seç</h2>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={budgetId}
                      onChange={(e) => setBudgetId(e.target.value)}
                    >
                      <option value="">Bütçe seçiniz</option>
                      {budgetOptions.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} {b.goal ? `- ${b.goal}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onCreateIncomes()}
                className="mt-5 w-full rounded-full"
              >
                Gelir Kaynağı Ekle
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateIncomes;
