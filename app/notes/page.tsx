import { fetchNotes } from "../../lib/api";
import NotesClient from "./Notes.client";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export default async function NotesPage() {
  const queryClient = new QueryClient();
  
  // Prefetch data on server
  const initialData = await fetchNotes(1, 12, "");
  
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes(1, 12, ""),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={initialData} />
    </HydrationBoundary>
  );
} 