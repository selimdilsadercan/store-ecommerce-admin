import db from "@/lib/db"; // <--- this is the same as the snippet above
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

////

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    //parameter controller
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    //prisma
    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
    ////
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

////

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    //authantication control
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    //body control
    const body = await req.json();
    const { name, billboardId } = body;
    if (!name || !billboardId) {
      return new NextResponse("Missing name or billboardId", { status: 400 });
    }

    //paramaters control
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    //authorization control
    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //prisma
    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
    ////
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
