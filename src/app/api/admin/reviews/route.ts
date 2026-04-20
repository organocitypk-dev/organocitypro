import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const reviewSchema = z.object({
  authorName: z.string().min(1),
  authorImage: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  content: z.string().min(1),
  productId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const isFeatured = searchParams.get("isFeatured");
    const where: any = {};
    if (isFeatured !== null) where.isFeatured = isFeatured === "true";
    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = reviewSchema.parse(body);
    const review = await prisma.review.create({ data: validated });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}