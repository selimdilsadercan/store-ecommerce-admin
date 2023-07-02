import db from "@/lib/db"; // <--- this is the same as the snippet above
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

////

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    //parameter controller
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    //prisma
    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
    ////
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

////

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    //authentication control
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    //paramaters control
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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
    const category = await db.category.delete({
      //todo ne zaman delete ne zaman deletMany?
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
    ////
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

////

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
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
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    ////

    //prisma
    const category = await db.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
    ////
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
