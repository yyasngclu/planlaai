"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AddExpense from "./_components/AddExpense";
import EditExpense from "./_components/EditExpense";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();
  const [showAdd, setShowAdd] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && getAllExpenses();
  }, [user]);

  const getAllExpenses = async () => {
    setLoading(true);
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Expenses)
      .where(Expenses.createdBy.eq(user?.primaryEmailAddress.emailAddress))
      .orderBy(Expenses.id.desc());
    setExpensesList(result);
    setLoading(false);
  };

  const handleDeleteExpense = async (expense) => {
    setLoading(true);
    await db.delete(Expenses).where(Expenses.id.eq(expense.id));
    toast("Gider silindi!");
    setDeleteExpense(null);
    getAllExpenses();
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-3xl">Giderlerim</h2>
        <Button onClick={() => setShowAdd(true)} className="rounded-full px-6 py-2 text-lg">
          + Gider Ekle
        </Button>
      </div>
      {/* Giderler kart görünümü */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expensesList.length === 0 && !loading && (
          <div className="col-span-2 text-center text-gray-500">Henüz gider eklenmedi.</div>
        )}
        {expensesList.map((expense) => (
          <div key={expense.id} className="bg-white shadow rounded-xl p-5 flex flex-col gap-2 relative">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{expense.name}</div>
                <div className="text-gray-500 text-sm">{expense.createdAt}</div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => setEditExpense(expense)}>
                  <Pencil className="w-5 h-5 text-blue-600" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setDeleteExpense(expense)}>
                  <Trash className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="text-xl font-bold text-green-700">₺{expense.amount}</div>
          </div>
        ))}
      </div>
      {/* Ekleme Modalı */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <AddExpense
          user={user}
          refreshData={getAllExpenses}
          onClose={() => setShowAdd(false)}
        />
      </Dialog>
      {/* Düzenleme Modalı */}
      <Dialog open={!!editExpense} onOpenChange={() => setEditExpense(null)}>
        {editExpense && (
          <EditExpense
            expense={editExpense}
            refreshData={getAllExpenses}
            onClose={() => setEditExpense(null)}
          />
        )}
      </Dialog>
      {/* Silme Onay Modalı */}
      <Dialog open={!!deleteExpense} onOpenChange={() => setDeleteExpense(null)}>
        {deleteExpense && (
          <div className="bg-white p-6 rounded-xl max-w-xs mx-auto flex flex-col items-center">
            <Trash className="w-10 h-10 text-red-500 mb-2" />
            <div className="mb-4 text-center">"{deleteExpense.name}" giderini silmek istediğine emin misin?</div>
            <div className="flex gap-2 w-full">
              <Button className="w-full" variant="destructive" onClick={() => handleDeleteExpense(deleteExpense)} disabled={loading}>
                Sil
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setDeleteExpense(null)}>
                İptal
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default ExpensesScreen;
