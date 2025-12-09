"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPacksByCourse(courseId: number) {
  try {
    const packs = await prisma.pack.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: { chapters: true },
        },
      },
    });
    return { success: true, packs };
  } catch (error) {
    console.error("Failed to fetch packs:", error);
    return { success: false, error: "Failed to fetch packs" };
  }
}

export async function getAllPacksByCourse(courseId: number) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const packs = await prisma.pack.findMany({
      where: {
        courseId,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: { chapters: true },
        },
      },
    });
    return { success: true, packs };
  } catch (error) {
    console.error("Failed to fetch all packs:", error);
    return { success: false, error: "Failed to fetch packs" };
  }
}

export async function createPack(data: {
  courseId: number;
  title: string;
  description?: string;
  emoji?: string;
  isPublished?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Get the highest order value for this course
    const lastPack = await prisma.pack.findFirst({
      where: { courseId: data.courseId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const pack = await prisma.pack.create({
      data: {
        ...data,
        order: (lastPack?.order ?? -1) + 1,
      },
    });

    revalidatePath(`/packs/${data.courseId}`);
    revalidatePath("/adminpanel");
    
    return { success: true, pack };
  } catch (error) {
    console.error("Failed to create pack:", error);
    return { success: false, error: "Failed to create pack" };
  }
}

export async function updatePack(
  id: number,
  data: {
    title?: string;
    description?: string;
    emoji?: string;
    isPublished?: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const pack = await prisma.pack.update({
      where: { id },
      data,
    });

    revalidatePath(`/packs/${pack.courseId}`);
    revalidatePath("/adminpanel");
    
    return { success: true, pack };
  } catch (error) {
    console.error("Failed to update pack:", error);
    return { success: false, error: "Failed to update pack" };
  }
}

export async function deletePack(id: number) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const pack = await prisma.pack.findUnique({
      where: { id },
      select: { courseId: true },
    });

    await prisma.pack.delete({
      where: { id },
    });

    if (pack) {
      revalidatePath(`/packs/${pack.courseId}`);
      revalidatePath("/adminpanel");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete pack:", error);
    return { success: false, error: "Failed to delete pack" };
  }
}

export async function getCourseByLanguageCode(languageCode: string) {
  try {
    const course = await prisma.course.findFirst({
      where: {
        languageCode,
        isPublished: true,
      },
    });
    
    if (!course) {
      return { success: false, error: "Course not found" };
    }
    
    return { success: true, course };
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return { success: false, error: "Failed to fetch course" };
  }
}
