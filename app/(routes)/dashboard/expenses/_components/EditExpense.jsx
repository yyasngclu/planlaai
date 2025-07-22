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
    <div className="bg-white p-6 rounded-xl w-[350px] flex flex-col gap-3">
      <h2 className="font-bold text-xl mb-2">Gideri Düzenle</h2>
      <Input
        placeholder="Gider adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Tutar"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-2"
        type="number"
        min="0"
      />
      <div className="flex gap-2 mt-2">
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