import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import NotePreview from "../../@modal/(.)notes/[id]/NotePreview.client";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;
  
  await queryClient.prefetchQuery({
    queryKey: ["note", resolvedParams.id],
    queryFn: () => fetchNoteById(resolvedParams.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={resolvedParams.id} />
    </HydrationBoundary>
  );
}
