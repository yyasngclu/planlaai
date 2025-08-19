import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, getTableColumns, sql, desc } from "drizzle-orm";

export async function POST(req) {
  try {
    const { name, amount, createdBy, icon } = await req.json();
    
    const result = await db
      .insert(Budgets)
      .values({
        name,
        amount,
        createdBy,
        icon,
      })
      .returning({ insertedId: Budgets.id });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy');
    
    const budgets = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, createdBy))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    
    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 