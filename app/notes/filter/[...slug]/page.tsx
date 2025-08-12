import NotesClient from "./Notes.client";

interface NotesPageProps {
  params: {
    slug: string[];
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0] || "All";
  
  return <NotesClient tag={tag} />;
} 