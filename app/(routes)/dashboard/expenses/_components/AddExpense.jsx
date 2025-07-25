import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpense({ budgetId, user, refreshData, onClose }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  /**
   * Used to Add New Expense
   */
  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId || null,
        createdAt: moment().format("DD/MM/yyyy"),
        createdBy: user?.primaryEmailAddress.emailAddress,
      })
      .returning({ insertedId: Expenses.id });
    setAmount("");
    setName("");
    if (result) {
      setLoading(false);
      refreshData();
      toast("Yeni gider eklendi!");
      onClose && onClose();
    }
    setLoading(false);
  };
  return (
    <div className="bg-white p-6 rounded-xl w-[350px] flex flex-col gap-3">
      <h2 className="font-bold text-xl mb-2">Yeni Gider Ekle</h2>
      <Input
        placeholder="Gider adı (örn. Market)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
      />
      <Input
        placeholder="Tutar (örn. 1000)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-2"
        type="number"
        min="0"
      />
      <div className="flex gap-2 mt-2">
        <Button
          disabled={!(name && amount) || loading}
          onClick={addNewExpense}
          className="w-full rounded-full"
        >
          {loading ? <Loader className="animate-spin" /> : "Ekle"}
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

export default AddExpense;
