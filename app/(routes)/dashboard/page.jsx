"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";

import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
function Dashboard() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  useEffect(() => {
    user && getBudgetList();
  }, [user]);
  /**
   * used to get budget List
   */
  const getBudgetList = async () => {
    try {
      const response = await fetch(`/api/budgets?createdBy=${user?.primaryEmailAddress?.emailAddress}`);
      const result = await response.json();
      
      if (result.success) {
        setBudgetList(result.data);
      }
      getAllExpenses();
      getIncomeList();
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    try {
      const response = await fetch(`/api/incomes?createdBy=${user?.primaryEmailAddress?.emailAddress}`);
      const result = await response.json();
      
      if (result.success) {
        setIncomeList(result.data);
      }
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    try {
      const response = await fetch(`/api/expenses?createdBy=${user?.primaryEmailAddress?.emailAddress}`);
      const result = await response.json();
      
      if (result.success) {
        setExpensesList(result.data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl mb-2">Merhaba, {user?.fullName} 👋</h2>
      <nav className="flex flex-wrap gap-4 mb-6">
        <span className="font-semibold text-blue-700">Genel Bakış</span>
        <span className="font-semibold text-gray-700">Hedeflerim / Bütçelerim</span>
        <span className="font-semibold text-green-700">Gelirler</span>
        <span className="font-semibold text-red-700">Giderler</span>
        <span className="font-semibold text-purple-700">AI Tavsiyeleri</span>
        <span className="font-semibold text-orange-700">Hesabım / Yükselt</span>
      </nav>

      {/* Genel Bakış Alanı */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h2 className="font-bold text-lg text-blue-700 mb-2">Genel Bakış</h2>
        <CardInfo budgetList={budgetList} incomeList={incomeList} />
        {/* AI Tavsiyesi Genel Bakış'ın içinde öne çıkarılıyor */}
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <h2 className="font-bold text-lg text-purple-700 mb-2">Yapay Zeka Tavsiyesi</h2>
          <div className="text-sm text-purple-800">
            Hedeflerine ulaşmak için harcamalarını gözden geçir, haftalık tasarruf miktarını artır ve gereksiz giderleri azaltmayı dene. İstersen buraya daha kişisel veya dinamik öneriler ekleyebilirim.
          </div>
        </div>
      </div>

      {/* Hedeflerim/Bütçelerim */}
      <div className="mb-6">
        <h2 className="font-bold text-lg text-gray-700 mb-2">Hedeflerim / Bütçelerim</h2>
        {budgetList?.length > 0
          ? budgetList.map((budget, index) => (
              <div key={index} className="border rounded-lg p-4 mb-2">
                <BudgetItem budget={budget} />
                {budget.goal && (
                  <div className="mt-2 text-xs text-blue-600">Hedef: {budget.goal}</div>
                )}
                <div className="mt-1 text-xs text-green-700">Kalan: ₺{budget.amount - (budget.totalSpend || 0)}</div>
                {/* AI önerisi alanı (dummy) */}
                <div className="mt-2 text-xs text-purple-700 bg-purple-50 p-2 rounded">
                  <strong>Yapay Zeka Tavsiyesi:</strong> Hedefine ulaşmak için haftalık {Math.ceil((budget.amount - (budget.totalSpend || 0))/4)}₺ biriktirmeni öneriyoruz.
                </div>
              </div>
            ))
          : [1, 2, 3, 4].map((item, index) => (
              <div className="h-[180xp] w-full bg-slate-200 rounded-lg animate-pulse" key={index}></div>
            ))}
      </div>

      {/* Gelirler */}
      <div className="mb-6">
        <h2 className="font-bold text-lg text-green-700 mb-2">Gelirler</h2>
        {/* Buraya gelir listesi ve ekleme componenti entegre edilebilir */}
      </div>

      {/* Giderler */}
      <div className="mb-6">
        <h2 className="font-bold text-lg text-red-700 mb-2">Giderler</h2>
        {/* Buraya gider listesi ve ekleme componenti entegre edilebilir */}
      </div>

      {/* Hesabım/Yükselt */}
      <div className="mb-6">
        <h2 className="font-bold text-lg text-orange-700 mb-2">Hesabım / Yükselt</h2>
        {/* Buraya profil, yükseltme ve ayarlar componenti entegre edilebilir */}
      </div>
    </div>
  );
}

export default Dashboard;
