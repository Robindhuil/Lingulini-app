"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getChaptersByPack(packId: number) {
  try {
    const chapters = await prisma.chapter.findMany({
      where: {
        packId,
        isPublished: true,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: { vocabularies: true },
        },
      },
    });
    return { success: true, chapters };
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return { success: false, error: "Failed to fetch chapters" };
  }
}

export async function getAllChaptersByPack(packId: number) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const chapters = await prisma.chapter.findMany({
      where: {
        packId,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: { vocabularies: true },
        },
      },
    });
    return { success: true, chapters };
  } catch (error) {
    console.error("Failed to fetch all chapters:", error);
    return { success: false, error: "Failed to fetch chapters" };
  }
}

export async function createChapter(data: {
  packId: number;
  title: string;
  description?: string;
  isPublished?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Get the highest order value for this pack
    const lastChapter = await prisma.chapter.findFirst({
      where: { packId: data.packId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const chapter = await prisma.chapter.create({
      data: {
        ...data,
        order: (lastChapter?.order ?? -1) + 1,
      },
    });

    revalidatePath(`/packs/[languageCode]/pack/${data.packId}`);
    revalidatePath("/adminpanel");
    
    return { success: true, chapter };
  } catch (error) {
    console.error("Failed to create chapter:", error);
    return { success: false, error: "Failed to create chapter" };
  }
}

export async function updateChapter(
  id: number,
  data: {
    title?: string;
    description?: string;
    isPublished?: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const chapter = await prisma.chapter.update({
      where: { id },
      data,
    });

    revalidatePath(`/packs/[languageCode]/pack/${chapter.packId}`);
    revalidatePath("/adminpanel");
    
    return { success: true, chapter };
  } catch (error) {
    console.error("Failed to update chapter:", error);
    return { success: false, error: "Failed to update chapter" };
  }
}

export async function deleteChapter(id: number) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      select: { packId: true },
    });

    await prisma.chapter.delete({
      where: { id },
    });

    if (chapter) {
      revalidatePath(`/packs/[languageCode]/pack/${chapter.packId}`);
      revalidatePath("/adminpanel");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete chapter:", error);
    return { success: false, error: "Failed to delete chapter" };
  }
}

export async function getPackWithCourse(packId: number) {
  try {
    const pack = await prisma.pack.findUnique({
      where: { id: packId },
      include: {
        course: true,
      },
    });
    
    if (!pack) {
      return { success: false, error: "Pack not found" };
    }
    
    return { success: true, pack };
  } catch (error) {
    console.error("Failed to fetch pack:", error);
    return { success: false, error: "Failed to fetch pack" };
  }
}
