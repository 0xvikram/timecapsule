import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Fetch a single capsule by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const capsule = await prisma.capsule.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, image: true } },
        goals: true,
      },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    // Check if private and user doesn't own it
    if (!capsule.isPublic && capsule.userId !== session?.user?.id) {
      return NextResponse.json(
        { error: "You don't have permission to view this capsule" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: capsule.id,
      title: capsule.title,
      description: capsule.description,
      unlockDate: capsule.unlockDate.toISOString(),
      isPublic: capsule.isPublic,
      status: capsule.status,
      userId: capsule.userId,
      createdAt: capsule.createdAt.toISOString(),
      goals: capsule.goals.map((g) => ({
        id: g.id,
        text: g.text,
        expectedDate: g.expectedDate,
        status: g.status,
      })),
      user: capsule.user,
    });
  } catch (error) {
    console.error("Error fetching capsule:", error);
    return NextResponse.json(
      { error: "Failed to fetch capsule" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a capsule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to delete a capsule" },
        { status: 401 }
      );
    }

    // Check if user owns the capsule
    const capsule = await prisma.capsule.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (capsule.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this capsule" },
        { status: 403 }
      );
    }

    await prisma.capsule.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting capsule:", error);
    return NextResponse.json(
      { error: "Failed to delete capsule" },
      { status: 500 }
    );
  }
}

// PATCH: Update a capsule
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to update a capsule" },
        { status: 401 }
      );
    }

    // Check if user owns the capsule
    const existingCapsule = await prisma.capsule.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingCapsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (existingCapsule.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this capsule" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, unlockDate, isPublic, status } = body;

    const capsule = await prisma.capsule.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(unlockDate && { unlockDate: new Date(unlockDate) }),
        ...(isPublic !== undefined && { isPublic }),
        ...(status && { status }),
      },
      include: { goals: true },
    });

    return NextResponse.json({
      id: capsule.id,
      title: capsule.title,
      description: capsule.description,
      unlockDate: capsule.unlockDate.toISOString(),
      isPublic: capsule.isPublic,
      status: capsule.status,
      userId: capsule.userId,
      createdAt: capsule.createdAt.toISOString(),
      goals: capsule.goals,
    });
  } catch (error) {
    console.error("Error updating capsule:", error);
    return NextResponse.json(
      { error: "Failed to update capsule" },
      { status: 500 }
    );
  }
}
