import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { name, amount, budgetId, createdAt } = await req.json();
    
    const result = await db
      .insert(Expenses)
      .values({
        name,
        amount,
        budgetId,
        createdAt,
      })
      .returning({ insertedId: Expenses.id });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy');
    const budgetId = searchParams.get('budgetId');
    
    if (budgetId) {
      // Belirli bir budget'a ait expenses
      const expenses = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, parseInt(budgetId)));
      
      return NextResponse.json({ success: true, data: expenses });
    } else if (createdBy) {
      // Kullanıcının tüm expenses'leri
      const expenses = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, createdBy));
      
      return NextResponse.json({ success: true, data: expenses });
    }
    
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 