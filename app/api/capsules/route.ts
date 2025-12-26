import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Uncomment when database is connected

// Temporary: Use localStorage bridge until database is set up
// This allows the API to work without a database connection

export async function GET(request: NextRequest) {
  try {
    // When database is connected, use this:
    // const capsules = await prisma.capsule.findMany({
    //   where: { isPublic: true },
    //   orderBy: { createdAt: "desc" },
    //   include: {
    //     user: { select: { username: true } },
    //     goals: true,
    //   },
    // });

    // For now, return a message indicating API is ready
    return NextResponse.json({
      message: "API ready. Connect database to enable.",
      capsules: [],
    });
  } catch (error) {
    console.error("Error fetching capsules:", error);
    return NextResponse.json(
      { error: "Failed to fetch capsules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, unlockDate, isPublic, goals, userId } = body;

    // Validate required fields
    if (!title || !description || !unlockDate) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, unlockDate" },
        { status: 400 }
      );
    }

    // When database is connected, use this:
    // const capsule = await prisma.capsule.create({
    //   data: {
    //     title,
    //     description,
    //     unlockDate: new Date(unlockDate),
    //     isPublic: isPublic ?? true,
    //     userId,
    //     goals: goals
    //       ? {
    //           create: goals.map((g: any) => ({
    //             text: g.text,
    //             expectedDate: g.expectedDate,
    //             status: g.status || "pending",
    //           })),
    //         }
    //       : undefined,
    //   },
    //   include: { goals: true },
    // });

    // For now, return success with mock ID
    const capsule = {
      id: `api-${Date.now()}`,
      title,
      description,
      unlockDate,
      isPublic: isPublic ?? true,
      userId: userId || "anonymous",
      goals: goals || [],
      createdAt: new Date().toISOString(),
      status: "locked",
    };

    return NextResponse.json(capsule, { status: 201 });
  } catch (error) {
    console.error("Error creating capsule:", error);
    return NextResponse.json(
      { error: "Failed to create capsule" },
      { status: 500 }
    );
  }
}
