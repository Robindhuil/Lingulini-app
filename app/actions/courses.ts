"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return { success: true, courses };
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function getAllCourses() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const courses = await prisma.course.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return { success: true, courses };
  } catch (error) {
    console.error("Failed to fetch all courses:", error);
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function createCourse(data: {
  title: string;
  description?: string;
  languageCode: string;
  forSpeakersOf: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  emoji?: string;
  isPublished?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Get the highest order value
    const lastCourse = await prisma.course.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const course = await prisma.course.create({
      data: {
        ...data,
        order: (lastCourse?.order ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/adminpanel");
    
    return { success: true, course };
  } catch (error) {
    console.error("Failed to create course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(
  id: number,
  data: {
    title?: string;
    description?: string;
    languageCode?: string;
    forSpeakersOf?: string;
    level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    emoji?: string;
    isPublished?: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const course = await prisma.course.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/adminpanel");
    
    return { success: true, course };
  } catch (error) {
    console.error("Failed to update course:", error);
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(id: number) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.course.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/adminpanel");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}
