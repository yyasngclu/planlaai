import Link from "next/link";
import React from "react";

function IncomeItem({ budget }) {
  // Gelir için progress veya totalItem yok, sadeleştirildi
  const handleDelete = async () => {
    if (!window.confirm("Geliri silmek istediğinize emin misiniz?")) return;
    try {
      const response = await fetch(`/api/incomes/${budget.id}`, {
        method: "DELETE",
      });
      if (response.ok) window.location.reload();
    } catch (err) {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const handleEdit = () => {
    // Düzenleme modalı açılacak (modal kodu IncomeList'te olacak)
    if (typeof window !== "undefined" && window.editIncome)
      window.editIncome(budget);
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] flex flex-col justify-between">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{budget.name}</h2>
          </div>
        </div>
        <h2 className="font-bold text-red-800 text-lg">₺{budget.amount}</h2>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Düzenle
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default IncomeItem;
