"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import type { Note } from "../../../types/note";
import Link from "next/link";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams();
  const noteId = params.id as string;

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
    placeholderData: (previousData) => previousData,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.container}>
      <header className={css.header}>
        <Link href="/notes" className={css.backLink}>
          ← Повернутися до списку
        </Link>
      </header>

      <div className={css.item}>
        <div className={css.noteHeader}>
          <h2 className={css.title}>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          Створено: {new Date(note.createdAt).toLocaleDateString("uk-UA")}
        </p>
      </div>
    </div>
  );
} 