import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мої нотатки - NoteHub",
  description: "Переглядайте та створюйте нотатки з можливістю пошуку та категорізації",
};

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 