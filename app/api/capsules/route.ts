import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Fetch capsules (public or user's own)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "public" | "user"

    let whereClause: object = {};

    if (type === "public") {
      // Public capsules for explore page
      whereClause = { isPublic: true };
    } else if (type === "user" && session?.user?.id) {
      // User's own capsules for dashboard
      whereClause = { userId: session.user.id };
    } else if (session?.user?.id) {
      // Default: user's own capsules
      whereClause = { userId: session.user.id };
    } else {
      // Not logged in, only show public
      whereClause = { isPublic: true };
    }

    const capsules = await prisma.capsule.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true } },
        goals: true,
      },
    });

    // Transform to match frontend types
    const transformedCapsules = capsules.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      unlockDate: c.unlockDate.toISOString(),
      isPublic: c.isPublic,
      status: c.status,
      userId: c.userId,
      createdAt: c.createdAt.toISOString(),
      goals: c.goals.map((g) => ({
        id: g.id,
        text: g.text,
        expectedDate: g.expectedDate,
        status: g.status,
      })),
      user: c.user,
    }));

    return NextResponse.json(transformedCapsules);
  } catch (error) {
    console.error("Error fetching capsules:", error);
    return NextResponse.json(
      { error: "Failed to fetch capsules" },
      { status: 500 }
    );
  }
}

// POST: Create a new capsule
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to create a capsule" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, unlockDate, isPublic, goals } = body;

    // Validate required fields
    if (!title || !description || !unlockDate) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, unlockDate" },
        { status: 400 }
      );
    }

    const capsule = await prisma.capsule.create({
      data: {
        title,
        description,
        unlockDate: new Date(unlockDate),
        isPublic: isPublic ?? true,
        userId: session.user.id,
        status: "locked",
        goals: goals?.length
          ? {
              create: goals.map((g: { text: string; expectedDate: string; status?: string }) => ({
                text: g.text,
                expectedDate: g.expectedDate,
                status: g.status || "pending",
              })),
            }
          : undefined,
      },
      include: { goals: true },
    });

    return NextResponse.json(
      {
        id: capsule.id,
        title: capsule.title,
        description: capsule.description,
        unlockDate: capsule.unlockDate.toISOString(),
        isPublic: capsule.isPublic,
        status: capsule.status,
        userId: capsule.userId,
        createdAt: capsule.createdAt.toISOString(),
        goals: capsule.goals,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating capsule:", error);
    return NextResponse.json(
      { error: "Failed to create capsule" },
      { status: 500 }
    );
  }
}
