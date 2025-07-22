import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ExpenseListTable({ expensesList = [], refreshData, onEdit }) {
  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast("Expense Deleted!");
      refreshData();
    }
  };
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Son Giderler</h2>
      <div className="grid grid-cols-5 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Ad</h2>
        <h2 className="font-bold">Tutar</h2>
        <h2 className="font-bold">Tarih</h2>
        <h2 className="font-bold">İşlem</h2>
        <h2 className="font-bold">Düzenle</h2>
      </div>
      {expensesList.map((expenses, index) => (
        <div key={expenses.id} className="grid grid-cols-5 bg-slate-50 rounded-bl-xl rounded-br-xl p-2 items-center">
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2
            onClick={() => deleteExpense(expenses)}
            className="text-red-500 cursor-pointer"
          >
            Sil
          </h2>
          <h2>
            <button
              className="text-blue-600 underline cursor-pointer"
              onClick={() => onEdit && onEdit(expenses)}
            >
              Düzenle
            </button>
          </h2>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
