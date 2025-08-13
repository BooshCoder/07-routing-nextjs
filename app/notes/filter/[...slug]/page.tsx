import NotesClient from "./Notes.client";
import { fetchNotesServer } from "../../../../lib/api";

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function NotesPage({ params, searchParams }: NotesPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tag = resolvedParams.slug[0] || "All";
  const page = parseInt(resolvedSearchParams.page || "1");
  const search = resolvedSearchParams.search || "";

  // Завантажуємо дані на сервері
  const initialData = await fetchNotesServer(page, 12, search, tag === "All" ? undefined : tag);

  return <NotesClient tag={tag} initialData={initialData} />;
} 