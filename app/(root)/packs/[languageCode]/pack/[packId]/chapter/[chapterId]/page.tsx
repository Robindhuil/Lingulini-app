import { auth } from "@/lib/auth";
import { getAllChaptersByPack } from "@/app/actions/chapters";
import { getChapterWithPack, getVocabulariesByChapter } from "@/app/actions/vocabulary";
import ChapterContent from "@/components/chapter/ChapterContent";
import { notFound } from "next/navigation";

interface ChapterPageProps {
  params: {
    languageCode: string;
    packId: string;
    chapterId: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { languageCode, packId, chapterId } = params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  // Get chapter with pack and course info
  const chapterResult = await getChapterWithPack(parseInt(chapterId));
  
  if (!chapterResult.success || !chapterResult.chapter) {
    notFound();
  }

  const chapter = chapterResult.chapter;

  // Verify pack ID and language code match
  if (
    chapter.pack.id !== parseInt(packId) || 
    chapter.pack.course.languageCode !== languageCode
  ) {
    notFound();
  }

  // Get all chapters for sidebar
  const chaptersResult = await getAllChaptersByPack(chapter.pack.id);
  const chapters = chaptersResult.success && chaptersResult.chapters ? chaptersResult.chapters : [];

  // Get vocabularies for this chapter
  const vocabResult = await getVocabulariesByChapter(chapter.id);
  const vocabularies = vocabResult.success && vocabResult.vocabularies ? vocabResult.vocabularies : [];

  return (
    <div className="min-h-screen">
      <ChapterContent 
        chapter={chapter}
        chapters={chapters}
        vocabularies={vocabularies}
        isAdmin={isAdmin}
      />
    </div>
  );
}
