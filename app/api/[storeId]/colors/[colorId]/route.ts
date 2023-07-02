import db from "@/lib/db"; // <--- this is the same as the snippet above
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

////

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } },
) {
  try {
    //parameter controller
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    //prisma
    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
    ////
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

////

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
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
    if (!params.colorId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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
    const color = await db.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
    ////
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

////

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
    //authantication control
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthanticated", { status: 401 });
    }

    //body control
    const body = await req.json();
    const { name, value } = body;
    if (!name || !value) {
      return new NextResponse("Missing name or value", { status: 400 });
    }

    //paramaters control
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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
    const color = await db.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
    ////
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
