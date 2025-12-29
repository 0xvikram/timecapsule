import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, generateCapsuleCreatedEmail } from "@/lib/email";

// GET: Fetch capsules (public or user's own)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "public" | "user"
    const sort = searchParams.get("sort"); // "latest" | "trending"

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
        likes: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    // Transform to match frontend types
    let transformedCapsules = capsules.map((c) => ({
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
      likeCount: c._count.likes,
      likedByMe: session?.user?.id 
        ? c.likes.some((like) => like.userId === session.user.id)
        : false,
    }));

    // Sort by trending (most likes) if requested
    if (sort === "trending") {
      transformedCapsules = transformedCapsules.sort((a, b) => b.likeCount - a.likeCount);
    }

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
    const { title, description, unlockDate, isPublic, goals, reminder, sendCreationEmail } = body;

    // Validate required fields
    if (!title || !description || !unlockDate) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, unlockDate" },
        { status: 400 }
      );
    }

    // Calculate reminder next send date if reminder is provided
    let reminderNextSend: Date | undefined;
    if (reminder && reminder.enabled) {
      const unlock = new Date(unlockDate);
      let daysBeforeUnlock = 30; // Default: month before
      
      if (reminder.type === "week_before") {
        daysBeforeUnlock = 7;
      } else if (reminder.type === "custom" && reminder.customDays) {
        daysBeforeUnlock = reminder.customDays;
      }
      
      reminderNextSend = new Date(unlock.getTime() - daysBeforeUnlock * 24 * 60 * 60 * 1000);
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
        reminders: reminder?.enabled
          ? {
              create: {
                type: reminder.type,
                customDays: reminder.customDays,
                enabled: true,
                nextSend: reminderNextSend,
              },
            }
          : undefined,
      },
      include: { goals: true, reminders: true },
    });

    // Send creation confirmation email
    if (sendCreationEmail && session.user.email) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const capsuleUrl = `${baseUrl}/capsule/${capsule.id}`;
      
      const emailData = generateCapsuleCreatedEmail({
        userName: session.user.name || "Time Traveler",
        capsuleTitle: capsule.title,
        unlockDate: capsule.unlockDate.toISOString(),
        capsuleUrl,
        isPublic: capsule.isPublic,
      });
      
      emailData.to = session.user.email;
      
      // Send email in background (don't await)
      sendEmail(emailData).catch((err) => 
        console.error("Failed to send creation email:", err)
      );
    }

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
        reminders: capsule.reminders,
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
