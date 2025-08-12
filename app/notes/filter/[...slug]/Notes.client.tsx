"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, fetchNoteById, type FetchNotesResponse } from "../../../../lib/api";
import NoteList from "../../../../components/NoteList/NoteList";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../components/Pagination/Pagination";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import Link from "next/link";
import styles from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Скидаємо на першу сторінку при пошуку
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, 12, debouncedSearch, tag === "All" ? undefined : tag),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: selectedNote, isLoading: isNoteLoading } = useQuery({
    queryKey: ["note", selectedNoteId],
    queryFn: () => fetchNoteById(selectedNoteId!),
    enabled: !!selectedNoteId,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
  };

  const handleViewNote = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleCloseNoteModal = () => {
    setSelectedNoteId(null);
  };



  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <SearchBox value={search} onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            setPage={setPage}
            pageCount={data.totalPages}
          />
        )}
        <button
          className={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && (
        <div className={styles.loading}>
          <p>Завантаження нотаток...</p>
        </div>
      )}

      {isError && (
        <div className={styles.error}>
          <p>Помилка завантаження нотаток. Спробуйте ще раз.</p>
        </div>
      )}

      {!isLoading && !isError && data && (
        <NoteList
          notes={data.notes || []}
          isLoading={false}
          isError={false}
          onViewNote={handleViewNote}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      {selectedNoteId && (
        <Modal onClose={handleCloseNoteModal}>
          {isNoteLoading ? (
            <div className={styles.loading}>
              <p>Завантаження нотатки...</p>
            </div>
          ) : selectedNote ? (
            <div className={styles.preview}>
              <header className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>{selectedNote.title}</h2>
                <span className={styles.previewTag}>{selectedNote.tag}</span>
              </header>
              
              <div className={styles.previewContent}>
                <p>{selectedNote.content}</p>
              </div>
              
              <footer className={styles.previewFooter}>
                <div className={styles.previewMeta}>
                  <span>Створено: {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                  {selectedNote.updatedAt !== selectedNote.createdAt && (
                    <span>Оновлено: {new Date(selectedNote.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </footer>
            </div>
          ) : (
            <div className={styles.error}>
              <h2>Помилка</h2>
              <p>Не вдалося завантажити нотатку</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
} 