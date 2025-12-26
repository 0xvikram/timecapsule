import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Uncomment when database is connected

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // When database is connected, use this:
    // const capsule = await prisma.capsule.findUnique({
    //   where: { id },
    //   include: {
    //     user: { select: { username: true } },
    //     goals: true,
    //   },
    // });
    //
    // if (!capsule) {
    //   return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    // }
    //
    // // Check if private and user doesn't own it
    // if (!capsule.isPublic) {
    //   // Add auth check here
    // }

    return NextResponse.json({
      message: "API ready. Connect database to enable.",
      id,
    });
  } catch (error) {
    console.error("Error fetching capsule:", error);
    return NextResponse.json(
      { error: "Failed to fetch capsule" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // When database is connected, use this:
    // await prisma.capsule.delete({ where: { id } });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error deleting capsule:", error);
    return NextResponse.json(
      { error: "Failed to delete capsule" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // When database is connected, use this:
    // const capsule = await prisma.capsule.update({
    //   where: { id },
    //   data: body,
    //   include: { goals: true },
    // });

    return NextResponse.json({
      success: true,
      id,
      message: "API ready. Connect database to enable.",
    });
  } catch (error) {
    console.error("Error updating capsule:", error);
    return NextResponse.json(
      { error: "Failed to update capsule" },
      { status: 500 }
    );
  }
}
