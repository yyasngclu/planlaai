import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, amount, icon } = await req.json();
    const result = await db
      .update(Incomes)
      .set({ name, amount, icon })
      .where(eq(Incomes.id, Number(id)));
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const result = await db.delete(Incomes).where(eq(Incomes.id, Number(id)));
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
