"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";

import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const [editIncomeData, setEditIncomeData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    user && getIncomelist();
    // window üzerinden edit fonksiyonu
    if (typeof window !== "undefined") {
      window.editIncome = (income) => {
        setEditIncomeData(income);
        setEditModalOpen(true);
      };
    }
  }, [user]);

  const getIncomelist = async () => {
    try {
      const response = await fetch(
        `/api/incomes?createdBy=${user?.primaryEmailAddress?.emailAddress}`
      );
      const result = await response.json();

      if (result.success) {
        setIncomelist(result.data);
      }
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/incomes/${editIncomeData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editIncomeData.name,
          amount: editIncomeData.amount,
          icon: editIncomeData.icon,
        }),
      });
      if (response.ok) {
        setEditModalOpen(false);
        setEditIncomeData(null);
        getIncomelist();
      }
    } catch (err) {
      alert("Düzenleme başarısız oldu.");
    }
  };

  return (
    <div className="mt-7">
      {/* Düzenleme Modalı */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded shadow w-full max-w-md"
          >
            <h2 className="text-lg font-bold mb-4">Geliri Düzenle</h2>
            <div className="mb-2">
              <label className="block mb-1">Ad</label>
              <input
                type="text"
                value={editIncomeData.name}
                onChange={(e) =>
                  setEditIncomeData({ ...editIncomeData, name: e.target.value })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Tutar</label>
              <input
                type="number"
                value={editIncomeData.amount}
                onChange={(e) =>
                  setEditIncomeData({
                    ...editIncomeData,
                    amount: e.target.value,
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">İkon</label>
              <input
                type="text"
                value={editIncomeData.icon}
                onChange={(e) =>
                  setEditIncomeData({ ...editIncomeData, icon: e.target.value })
                }
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Kaydet
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditModalOpen(false)}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncomes refreshData={() => getIncomelist()} />
        {incomelist?.length > 0
          ? incomelist.map((income, index) => (
              <IncomeItem income={income} key={index} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;
