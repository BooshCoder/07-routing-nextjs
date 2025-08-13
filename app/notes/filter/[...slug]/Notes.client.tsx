"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, FetchNotesResponse } from "../../../../lib/api";
import NoteList from "../../../../components/NoteList/NoteList";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../components/Pagination/Pagination";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import styles from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string;
  initialData: FetchNotesResponse;
}

export default function NotesClient({ tag, initialData }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Скидаємо сторінку одразу при зміні пошуку
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку одразу
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, 12, debouncedSearch, tag === "All" ? undefined : tag),
    retry: 3,
    retryDelay: 1000,
    initialData: initialData,
    placeholderData: (previousData) => previousData,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <SearchBox value={search} onChange={handleSearch} />
        <Pagination
          page={page}
          setPage={setPage}
          pageCount={data?.totalPages || 1}
        />
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
        <NoteList notes={data.notes || []} />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm
            onSuccess={handleCloseModal}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
} 