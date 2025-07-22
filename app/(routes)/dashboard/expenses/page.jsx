"use client";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";
import AddExpense from "./_components/AddExpense";
import EditExpense from "./_components/EditExpense";
import { Dialog } from "@/components/ui/dialog";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();
  const [showAdd, setShowAdd] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    user && getAllExpenses();
  }, [user]);
  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">Giderlerim</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 mb-4"
        onClick={() => setShowAdd(true)}
      >
        + Yeni Gider Ekle
      </button>
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <AddExpense
          user={user}
          refreshData={() => getAllExpenses()}
          onClose={() => setShowAdd(false)}
        />
      </Dialog>
      <Dialog open={!!editExpense} onOpenChange={() => setEditExpense(null)}>
        {editExpense && (
          <EditExpense
            expense={editExpense}
            refreshData={() => getAllExpenses()}
            onClose={() => setEditExpense(null)}
          />
        )}
      </Dialog>
      <ExpenseListTable
        refreshData={() => getAllExpenses()}
        expensesList={expensesList}
        onEdit={setEditExpense}
      />
    </div>
  );
}

export default ExpensesScreen;
