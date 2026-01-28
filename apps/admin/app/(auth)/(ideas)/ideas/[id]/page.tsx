"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createAuthor, fetchIdeaById } from "@repo/actions";
import { IdeaFullPageEditor } from "../../../_components/ideas/idea-full-page-editor";

interface IdeaPageProps {
  params: { id: string };
}

export default function IdeaPage({ params }: IdeaPageProps): JSX.Element {
  const router = useRouter();
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ideaExists, setIdeaExists] = useState(true);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        // Check if the idea exists first
        const idea = await fetchIdeaById(params.id);
        if (!idea) {
          setIdeaExists(false);
          // Redirect to ideas page if idea not found
          router.replace("/ideas");
          return;
        }

        // Load author
        const author = await createAuthor();
        if ("error" in author) {
          router.replace("/ideas");
          return;
        }
        setAuthorId(author.id);
      } catch {
        // On any error, redirect to ideas page
        router.replace("/ideas");
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ideaExists || !authorId) {
    // Show loading while redirecting
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <IdeaFullPageEditor authorId={authorId} ideaId={params.id} />
    </div>
  );
}
