import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const variationSchema = z.object({
  name: z.string().min(1, "Variation name is required"),
  value: z.string().min(1, "Variation value is required"),
  price: z.number().min(0, "Variation price must be positive"),
});

// GET /api/admin/products/[id]/variations - Get all variations for a product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const variations = await prisma.productVariation.findMany({
      where: { productId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ variations });
  } catch (error: any) {
    console.error("Error fetching variations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch variations" },
      { status: 401 }
    );
  }
}

// POST /api/admin/products/[id]/variations - Create a new variation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const validated = variationSchema.parse(body);

    const variation = await prisma.productVariation.create({
      data: {
        ...validated,
        productId: id,
      },
    });

    return NextResponse.json({ variation }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating variation:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create variation" },
      { status: 500 }
    );
  }
}