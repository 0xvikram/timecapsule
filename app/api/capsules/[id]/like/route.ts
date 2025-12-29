import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Like/Unlike a capsule (toggle)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: capsuleId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to like a capsule" },
        { status: 401 }
      );
    }

    // Check if capsule exists and is public
    const capsule = await prisma.capsule.findUnique({
      where: { id: capsuleId },
      select: { id: true, isPublic: true, userId: true },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (!capsule.isPublic && capsule.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Cannot like a private capsule" },
        { status: 403 }
      );
    }

    // Check if user already liked this capsule
    const existingLike = await prisma.capsuleLike.findUnique({
      where: {
        userId_capsuleId: {
          userId: session.user.id,
          capsuleId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.capsuleLike.delete({
        where: { id: existingLike.id },
      });

      // Get updated count
      const likeCount = await prisma.capsuleLike.count({
        where: { capsuleId },
      });

      return NextResponse.json({
        liked: false,
        likeCount,
        message: "Capsule unliked",
      });
    } else {
      // Like: Add new like
      await prisma.capsuleLike.create({
        data: {
          userId: session.user.id,
          capsuleId,
        },
      });

      // Get updated count
      const likeCount = await prisma.capsuleLike.count({
        where: { capsuleId },
      });

      return NextResponse.json({
        liked: true,
        likeCount,
        message: "Capsule liked",
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

// GET: Check if user has liked this capsule and get count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: capsuleId } = await params;
    const session = await getServerSession(authOptions);

    // Get like count
    const likeCount = await prisma.capsuleLike.count({
      where: { capsuleId },
    });

    // Check if current user has liked (if logged in)
    let liked = false;
    if (session?.user?.id) {
      const existingLike = await prisma.capsuleLike.findUnique({
        where: {
          userId_capsuleId: {
            userId: session.user.id,
            capsuleId,
          },
        },
      });
      liked = !!existingLike;
    }

    return NextResponse.json({ liked, likeCount });
  } catch (error) {
    console.error("Error getting like status:", error);
    return NextResponse.json(
      { error: "Failed to get like status" },
      { status: 500 }
    );
  }
}
