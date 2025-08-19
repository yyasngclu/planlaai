"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pen, PenBox, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setbudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();
  useEffect(() => {
    user && getBudgetInfo();
  }, [user]);

  /**
   * Get Budget Information
   */
  const getBudgetInfo = async () => {
    try {
      const response = await fetch(`/api/budgets/${params.id}?createdBy=${user?.primaryEmailAddress?.emailAddress}`);
      const result = await response.json();
      
      if (result.success) {
        setbudgetInfo(result.data);
      }
      getExpensesList();
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  };

  /**
   * Get Latest Expenses
   */
  const getExpensesList = async () => {
    try {
      const response = await fetch(`/api/expenses?budgetId=${params.id}`);
      const result = await response.json();
      
      if (result.success) {
        setExpensesList(result.data);
      }
    } catch (error) {
      console.error("Error fetching expenses list:", error);
    }
  };

  /**
   * Used to Delete budget
   */
  const deleteBudget = async () => {
    try {
      const response = await fetch(`/api/budgets/${params.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        toast("Budget Deleted !");
        route.replace("/dashboard/budgets");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast("Hata oluştu!");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          Giderlerim
        </span>
        <div className="flex gap-2 items-center">
          <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo()}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive">
                <Trash className="w-4" /> Gideri Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Silmek istediğinize emin misiniz?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  "Bu işlem geri alınamaz. Bu, mevcut bütçenizi ve giderlerinizi
                  kalıcı olarak silecek ve verilerinizi sunucularımızdan
                  kaldıracaktır."
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal Et</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Devam Et
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div
        className="grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5"
      >
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
