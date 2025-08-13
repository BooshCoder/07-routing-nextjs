import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import type { Note } from "../../types/note";
import Link from "next/link";
import css from "./NoteList.module.css";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";

interface NoteListProps {
  notes: Note[];
  isLoading?: boolean;
  isError?: boolean;
  onViewNote?: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, isLoading, isError, onViewNote }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorMessage />;
  if (notes.length === 0) return <EmptyState message="Нотаток не знайдено" />;

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li className={css.listItem} key={note.id}>
          <Link href={`/notes/${note.id}`} className={css.noteLink}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
          </Link>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            {onViewNote ? (
              <button 
                className={css.viewButton}
                onClick={() => onViewNote(note.id)}
              >
                View details
              </button>
            ) : (
              <Link href={`/notes/${note.id}`} className={css.viewButton}>
                View details
              </Link>
            )}
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.status === 'pending'}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;