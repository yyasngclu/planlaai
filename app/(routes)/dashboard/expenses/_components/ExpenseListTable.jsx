
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ExpenseListTable() {
  // Örnek 3 gider
  const expensesList = [
    {
      id: 1,
      name: "Market Alışverişi",
      amount: 1350,
      createdAt: "2025-06-01",
    },
    {
      id: 2,
      name: "Elektrik Faturası",
      amount: 1220,
      createdAt: "2025-06-03",
    },
    {
      id: 3,
      name: "Kira",
      amount: 15000,
      createdAt: "2025-06-05",
    },
  ];

  // refreshData fonksiyonu mocklandı
  const refreshData = () => {};

  const deleteExpense = async (expense) => {
    try {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        toast("Expense Deleted!");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast("Hata oluştu!");
    }
  };
  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Son Giderler</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Ad</h2>
        <h2 className="font-bold">Tutar</h2>
        <h2 className="font-bold">Tarih</h2>
        <h2 className="font-bold">İşlem</h2>
      </div>
      {expensesList.map((expenses, index) => (
        <div className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2">
          <h2>{expenses.name}</h2>
          <h2>{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2
            onClick={() => deleteExpense(expenses)}
            className="text-red-500 cursor-pointer"
          >
            Delete
          </h2>
          {/* <h2>
            <Trash
              className="text-red-500 cursor-pointer"
              onClick={() => deleteExpense(expenses)}
            />
          </h2> */}
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
