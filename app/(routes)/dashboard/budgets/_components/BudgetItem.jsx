import Link from "next/link";
import React from "react";

function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };
  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer min-h-[200px] flex flex-col justify-between">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">{budget?.icon}</h2>
            <div>
              <h2 className="font-bold">{budget.name}</h2>
              {budget.goal && <h2 className="text-xs text-blue-500">Hedef: {budget.goal}</h2>}
              <h2 className="text-sm text-gray-500">{budget.totalItem} Öğe</h2>
            </div>
          </div>
          <h2 className="font-bold text-red-800 text-lg">₺{budget.amount}</h2>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">₺{budget.totalSpend ? budget.totalSpend : 0} Harcama</h2>
            <h2 className="text-xs text-slate-400">₺{budget.amount - budget.totalSpend} Kalan</h2>
          </div>
          <div className="w-full bg-slate-300 h-2 rounded-full">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${calculateProgressPerc()}%` }}></div>
          </div>
        </div>
        {/* Gelir ve gider özetleri */}
        <div className="mt-3 flex flex-col gap-1">
          {budget.incomes && budget.incomes.length > 0 && (
            <h2 className="text-xs text-green-600">Toplam Gelir: ₺{budget.incomes.reduce((acc, i) => acc + Number(i.amount), 0)}</h2>
          )}
          {budget.expenses && budget.expenses.length > 0 && (
            <h2 className="text-xs text-red-600">Toplam Gider: ₺{budget.expenses.reduce((acc, e) => acc + Number(e.amount), 0)}</h2>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
