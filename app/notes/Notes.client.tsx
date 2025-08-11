"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, type FetchNotesResponse } from "../../lib/api";
import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import Link from "next/link";
import styles from "../home.module.css";

interface NotesClientProps {
  initialData?: FetchNotesResponse;
}

export default function NotesClient({ initialData }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Скидаємо на першу сторінку при пошуку
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, 12, debouncedSearch),
    initialData: page === 1 && debouncedSearch === "" ? initialData : undefined,
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← На головну
        </Link>
        <h1 className={styles.title}>Мої нотатки</h1>
        <button
          className={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Створити нотатку
        </button>
      </header>

      <div className={styles.searchContainer}>
        <SearchBox value={search} onChange={handleSearch} />
      </div>

      {(isLoading || isError || (data && data.notes.length > 0)) && (
        <NoteList
          notes={data?.notes || []}
          isLoading={isLoading}
          isError={isError}
        />
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          pageCount={data.totalPages}
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
    </div>
  );
} 