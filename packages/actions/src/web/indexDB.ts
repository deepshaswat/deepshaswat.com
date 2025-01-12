import { PostListType } from "@repo/actions";

const DB_NAME = "DeepShaswatDotCom";
const STORE_NAME_BLOGS = "blogs-cache";
const CACHE_EXPIRATION_1_WEEK = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds
const CACHE_EXPIRATION_1_DAY = 1000 * 60 * 60 * 24; // 24 hours
interface CachedBlogData {
  id: string;
  data: PostListType[];
  timestamp: number;
}

export class BlogCache {
  private db: IDBDatabase | null = null;

  // Initialize IndexedDB
  async init(): Promise<void> {
    if (this.db) return;

    try {
      this.db = await new Promise((resolve, reject) => {
        console.log("Opening IndexedDB...");
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = (event) => {
          const error = (event.target as IDBOpenDBRequest).error;
          console.error(
            "Failed to open IndexedDB:",
            error?.message || "Unknown error",
          );
          reject(error);
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          console.log(
            "IndexedDB opened successfully. Object stores:",
            Array.from(db.objectStoreNames),
          );
          resolve(db);
        };

        request.onupgradeneeded = (event) => {
          console.log("Upgrading database...");
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME_BLOGS)) {
            console.log("Creating object store:", STORE_NAME_BLOGS);
            db.createObjectStore(STORE_NAME_BLOGS, { keyPath: "id" });
          }
        };
      });
    } catch (error) {
      console.error("Error during IndexedDB initialization:", error);
      throw error;
    }
  }

  // Generate a key for caching blogs
  private generateKey(option: string): string {
    return option; // Use option as the key (e.g., "articles", "featured-posts")
  }

  // Get cached blog data for a specific option
  async getCachedBlogs(option: string): Promise<PostListType[] | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME_BLOGS, "readonly");
      const store = transaction.objectStore(STORE_NAME_BLOGS);
      const request = store.get(this.generateKey(option));

      request.onerror = () => {
        console.error(
          `Failed to retrieve data for ${option} from IndexedDB:`,
          request.error,
        );
        reject(request.error);
      };

      request.onsuccess = () => {
        const cachedData: CachedBlogData | undefined = request.result;
        if (cachedData) {
          const isExpired =
            Date.now() - cachedData.timestamp > CACHE_EXPIRATION_1_DAY;
          if (isExpired) {
            console.log(`Cached data for ${option} is expired`);
            resolve(null);
          } else {
            console.log(`Using cached data for ${option}`);
            resolve(cachedData.data);
          }
        } else {
          console.log(`No cached data found for ${option}`);
          resolve(null);
        }
      };
    });
  }

  // Set cached blog data for a specific option
  async setCachedBlogs(option: string, data: PostListType[]): Promise<void> {
    try {
      if (!this.db) {
        console.log("Initializing IndexedDB before setting cache...");
        await this.init();
      }

      if (!this.db) {
        throw new Error("Failed to initialize IndexedDB");
      }

      return new Promise((resolve, reject) => {
        console.log(`Attempting to store data for ${option} in IndexedDB...`);
        const transaction = this.db!.transaction(STORE_NAME_BLOGS, "readwrite");

        transaction.onerror = (event) => {
          const error = (event.target as IDBTransaction).error;
          console.error(
            `Transaction error for ${option}:`,
            error?.message || "Unknown error",
          );
          reject(error);
        };

        const store = transaction.objectStore(STORE_NAME_BLOGS);
        const cacheData = {
          id: this.generateKey(option),
          data,
          timestamp: Date.now(),
        };

        console.log(`Storing cache data for ${option}:`, {
          id: cacheData.id,
          dataLength: data.length,
          timestamp: new Date(cacheData.timestamp).toISOString(),
        });

        const request = store.put(cacheData);

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          console.error(
            `Failed to store data for ${option} in IndexedDB:`,
            error?.message || "Unknown error",
          );
          reject(error);
        };

        request.onsuccess = () => {
          console.log(`Data stored successfully for ${option} in IndexedDB`);
          resolve();
        };
      });
    } catch (error) {
      console.error(`Error in setCachedBlogs for ${option}:`, error);
      throw error;
    }
  }
}

export const blogCache = new BlogCache();
