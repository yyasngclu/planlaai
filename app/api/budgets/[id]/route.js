import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy');
    
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, createdBy))
      .where(eq(Budgets.id, parseInt(id)))
      .groupBy(Budgets.id);

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, amount, icon } = await req.json();
    
    const result = await db
      .update(Budgets)
      .set({
        name,
        amount,
        icon,
      })
      .where(eq(Budgets.id, parseInt(id)))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    
    // Önce bu budget'a ait tüm expenses'leri sil
    await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, parseInt(id)));
    
    // Sonra budget'ı sil
    const result = await db
      .delete(Budgets)
      .where(eq(Budgets.id, parseInt(id)))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 