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
    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
    ////
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
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
    const { label, imageUrl } = body;
    if (!label || !imageUrl) {
      return new NextResponse("Missing label or image url", { status: 400 });
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
    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
    ////
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
