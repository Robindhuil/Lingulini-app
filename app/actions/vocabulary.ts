"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVocabulariesByChapter(chapterId: number) {
  try {
    const vocabularies = await prisma.vocabulary.findMany({
      where: {
        chapterId,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return { success: true, vocabularies };
  } catch (error) {
    console.error("Failed to fetch vocabularies:", error);
    return { success: false, error: "Failed to fetch vocabularies" };
  }
}

export async function createVocabulary(data: {
  chapterId: number;
  word: string;
  translation: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  example?: string;
  exampleTranslation?: string;
  type: "WORD" | "PHRASE" | "SENTENCE";
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Get the highest order value for this chapter
    const lastVocab = await prisma.vocabulary.findFirst({
      where: { chapterId: data.chapterId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const vocabulary = await prisma.vocabulary.create({
      data: {
        ...data,
        order: (lastVocab?.order ?? -1) + 1,
      },
    });

    revalidatePath(`/packs/[languageCode]/pack/[packId]/chapter/${data.chapterId}`);
    
    return { success: true, vocabulary };
  } catch (error) {
    console.error("Failed to create vocabulary:", error);
    return { success: false, error: "Failed to create vocabulary" };
  }
}

export async function updateVocabulary(
  id: number,
  data: {
    word?: string;
    translation?: string;
    pronunciation?: string;
    audioUrl?: string;
    imageUrl?: string;
    example?: string;
    exampleTranslation?: string;
    type?: "WORD" | "PHRASE" | "SENTENCE";
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const vocabulary = await prisma.vocabulary.update({
      where: { id },
      data,
    });

    revalidatePath(`/packs/[languageCode]/pack/[packId]/chapter/${vocabulary.chapterId}`);
    
    return { success: true, vocabulary };
  } catch (error) {
    console.error("Failed to update vocabulary:", error);
    return { success: false, error: "Failed to update vocabulary" };
  }
}

export async function deleteVocabulary(id: number) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id },
      select: { chapterId: true },
    });

    await prisma.vocabulary.delete({
      where: { id },
    });

    if (vocabulary) {
      revalidatePath(`/packs/[languageCode]/pack/[packId]/chapter/${vocabulary.chapterId}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete vocabulary:", error);
    return { success: false, error: "Failed to delete vocabulary" };
  }
}

export async function getChapterWithPack(chapterId: number) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        pack: {
          include: {
            course: true,
          },
        },
      },
    });
    
    if (!chapter) {
      return { success: false, error: "Chapter not found" };
    }
    
    return { success: true, chapter };
  } catch (error) {
    console.error("Failed to fetch chapter:", error);
    return { success: false, error: "Failed to fetch chapter" };
  }
}
