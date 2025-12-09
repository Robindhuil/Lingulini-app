import { auth } from "@/lib/auth";
import { getPackWithCourse, getAllChaptersByPack } from "@/app/actions/chapters";
import PackContent from "@/components/pack/PackContent";
import { notFound } from "next/navigation";

interface PackPageProps {
  params: {
    languageCode: string;
    packId: string;
  };
}

export default async function PackPage({ params }: PackPageProps) {
  const { languageCode, packId } = params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  // Get pack with course info
  const packResult = await getPackWithCourse(parseInt(packId));
  
  if (!packResult.success || !packResult.pack) {
    notFound();
  }

  const pack = packResult.pack;

  // Verify language code matches
  if (pack.course.languageCode !== languageCode) {
    notFound();
  }

  // Get chapters for this pack
  const chaptersResult = await getAllChaptersByPack(pack.id);
  const chapters = chaptersResult.success && chaptersResult.chapters ? chaptersResult.chapters : [];

  return (
    <div className="min-h-screen">
      <PackContent 
        pack={pack}
        chapters={chapters}
        isAdmin={isAdmin}
      />
    </div>
  );
}
