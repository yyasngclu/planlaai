import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function EditExpense({ expense, refreshData, onClose }) {
  const [name, setName] = useState(expense.name || "");
  const [amount, setAmount] = useState(expense.amount || "");
  const [loading, setLoading] = useState(false);

  const updateExpense = async () => {
    setLoading(true);
    const result = await db
      .update(Expenses)
      .set({
        name: name,
        amount: amount,
      })
      .where(Expenses.id.eq(expense.id))
      .returning();
    setLoading(false);
    if (result) {
      toast("Gider güncellendi!");
      refreshData();
      onClose && onClose();
    }
  };

  return (
    <div className="border p-5 rounded-2xl bg-white w-[350px]">
      <h2 className="font-bold text-lg mb-2">Gideri Düzenle</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Gider Adı</h2>
        <Input
          placeholder="örn. Banyo Dekorasyonu"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Harcanan Miktar</h2>
        <Input
          placeholder="örn. 1000₺"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          disabled={!(name && amount) || loading}
          onClick={updateExpense}
          className="w-full rounded-full"
        >
          {loading ? <Loader className="animate-spin" /> : "Kaydet"}
        </Button>
        <Button
          variant="outline"
          onClick={() => onClose && onClose()}
          className="w-full rounded-full"
        >
          İptal
        </Button>
      </div>
    </div>
  );
}

export default EditExpense; 