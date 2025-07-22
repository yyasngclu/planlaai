import React, { useState } from "react";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";

function IncomeItem({ budget, refreshData }) {
  const [editOpen, setEditOpen] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState(budget?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(budget?.name);
  const [amount, setAmount] = useState(budget?.amount);

  const deleteIncome = async () => {
    const result = await db
      .delete(Incomes)
      .where(eq(Incomes.id, budget.id))
      .returning();
    if (result) {
      toast("Gelir Silindi!");
      refreshData && refreshData();
    }
  };

  const updateIncome = async () => {
    const result = await db
      .update(Incomes)
      .set({
        name: name,
        amount: amount,
        icon: emojiIcon,
      })
      .where(eq(Incomes.id, budget.id))
      .returning();
    if (result) {
      toast("Gelir Güncellendi!");
      setEditOpen(false);
      refreshData && refreshData();
    }
  };

  return (
    <div
      className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] flex flex-col justify-between"
    >
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{budget.name}</h2>
            <h2 className="text-sm text-gray-500">{budget.totalItem} Öğe</h2>
          </div>
        </div>
        <h2 className="font-bold text-red-800 text-lg">₺{budget.amount}</h2>
      </div>
      <div className="flex gap-2 mt-4">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-full w-full">Düzenle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Geliri Düzenle</DialogTitle>
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
                      defaultValue={budget?.name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mt-2">
                    <h2 className="text-black font-medium my-1">Aylık Tutar</h2>
                    <Input
                      type="number"
                      defaultValue={budget?.amount}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  disabled={!(name && amount)}
                  onClick={updateIncome}
                  className="mt-5 w-full rounded-full"
                >
                  Kaydet
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" className="rounded-full w-full" onClick={deleteIncome}>
          Sil
        </Button>
      </div>
    </div>
  );
}

export default IncomeItem;
