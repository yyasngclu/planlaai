"use client";
import React, { useEffect, useState } from "react";
import AIChat from "./_components/AIChat";
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
    <div className="p-8">
      <h2 className="font-bold text-4xl mb-2">AI ile Sohbet Et</h2>
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
        <p className="mb-2 text-purple-800">Yapay zekaya finansal sorular sorabilir, tavsiye alabilirsin.</p>
        <AIChat />
        {/* Örnek Sorular */}
        <div className="mt-4">
          <span className="font-semibold">Örnek Sorular:</span>
          <ul className="list-disc ml-6 text-purple-700 text-sm">
            <li>Bütçemi nasıl daha iyi yönetebilirim?</li>
            <li>Bu ay tasarruf etmek için ne yapmalıyım?</li>
            <li>Gelirimi artırmak için önerin var mı?</li>
            <li>Giderlerimi azaltmak için tavsiye verir misin?</li>
          </ul>
        </div>
      </div>

      {/* Hedeflerim/Bütçelerim */}
      {/* Diğer dashboard alanları burada kalabilir, istersen kaldırabilirim */}

      {/* Diğer dashboard alanları burada kalabilir, istersen kaldırabilirim */}
    </div>
  );
}

export default Dashboard;
