/**
 * Offline Storage Engine using IndexedDB
 * Allows villagers to download entire books (including all chapters) 
 * for 100% offline reading without internet/quota.
 */

const DB_NAME = "PustakaPangkalanOfflineDB";
const DB_VERSION = 1;
const STORE_NAME = "offline_books";

export interface OfflineChapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface OfflineBook {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string | null;
  downloadedAt: number;
  chapters: OfflineChapter[];
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this environment"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBookOffline(book: OfflineBook): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ ...book, downloadedAt: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineBook(bookId: string): Promise<OfflineBook | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(bookId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllOfflineBooks(): Promise<OfflineBook[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function removeBookOffline(bookId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(bookId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function isBookDownloaded(bookId: string): Promise<boolean> {
  const book = await getOfflineBook(bookId);
  return !!book;
}

export async function getOfflineChapter(chapterId: string): Promise<{ book: OfflineBook; chapter: OfflineChapter } | null> {
  const allBooks = await getAllOfflineBooks();
  for (const book of allBooks) {
    const chapter = book.chapters.find((c) => c.id === chapterId);
    if (chapter) {
      return { book, chapter };
    }
  }
  return null;
}
