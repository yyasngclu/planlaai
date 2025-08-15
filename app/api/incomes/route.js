import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, getTableColumns, sql } from "drizzle-orm";

export async function POST(req) {
  try {
    const { name, amount, createdBy, icon } = await req.json();
    
    const result = await db
      .insert(Incomes)
      .values({
        name,
        amount,
        createdBy,
        icon,
      })
      .returning({ insertedId: Incomes.id });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy');
    
    const incomes = await db
      .select({
        ...getTableColumns(Incomes),
        totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, createdBy))
      .groupBy(Incomes.id);
    
    return NextResponse.json({ success: true, data: incomes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 