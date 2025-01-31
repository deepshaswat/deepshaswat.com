import { PostListType } from "@repo/actions";

const DB_NAME = "DeepShaswatDB";
const STORE_NAMES = {
  BLOGS: "blogs-cache",
  COUNTS: "counts-cache",
  NEWSLETTERS: "newsletters-cache",
  BLOG_CONTENT: "blog-content-cache",
} as const;

const CACHE_KEYS = {
  ARTICLES_COUNT: "articles-count",
  NEWSLETTER_COUNT: "newsletter-count",
} as const;

const CACHE_EXPIRATION = 1000 * 60 * 60 * 24; // 24 hours
// const CACHE_EXPIRATION_1_WEEK = 1000 * 60 * 60 * 24 * 7; // 1 week

class CacheService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // console.log("CacheService: Constructor called, initializing...");
      this.initPromise = this.initDB();
    } else {
      console.log("CacheService: Running in SSR environment");
    }
  }

  private async initDB(): Promise<boolean> {
    if (typeof window === "undefined") {
      console.log("InitDB: Running in SSR environment");
      return false;
    }

    if (!window.indexedDB) {
      console.error("InitDB: IndexedDB not supported");
      return false;
    }

    try {
      this.db = await new Promise((resolve, reject) => {
        // console.log("InitDB: Opening database...");
        const openRequest = indexedDB.open(DB_NAME, 1);

        openRequest.onupgradeneeded = (event) => {
          // console.log("InitDB: Database upgrade needed");
          const db = (event.target as IDBOpenDBRequest).result;

          // Create stores if they don't exist
          [
            STORE_NAMES.BLOGS,
            STORE_NAMES.COUNTS,
            STORE_NAMES.NEWSLETTERS,
            STORE_NAMES.BLOG_CONTENT,
          ].forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) {
              // console.log(`InitDB: Creating store: ${storeName}`);
              db.createObjectStore(storeName, { keyPath: "id" });
            }
          });
        };

        openRequest.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          // console.log(
          //   "InitDB: Database opened successfully",
          //   Array.from(db.objectStoreNames)
          // );
          resolve(db);
        };

        openRequest.onerror = (event) => {
          console.error("InitDB: Error opening database:", openRequest.error);
          reject(openRequest.error);
        };
      });

      return true;
    } catch (error) {
      console.error("InitDB: Failed to initialize database:", error);
      return false;
    }
  }

  private async ensureInitialized(): Promise<boolean> {
    if (this.db) return true;
    if (!this.initPromise) this.initPromise = this.initDB();
    return await this.initPromise;
  }

  async getCachedCount(
    type: "articles" | "newsletters",
  ): Promise<number | null> {
    const cacheKey =
      type === "articles"
        ? CACHE_KEYS.ARTICLES_COUNT
        : CACHE_KEYS.NEWSLETTER_COUNT;
    // console.log(`GetCachedCount: Starting for ${type}...`);

    if (!(await this.ensureInitialized())) {
      // console.log(`GetCachedCount: Database not initialized for ${type}`);
      return null;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(
          [STORE_NAMES.COUNTS],
          "readonly",
        );
        const store = transaction.objectStore(STORE_NAMES.COUNTS);
        const request = store.get(cacheKey);

        request.onsuccess = () => {
          const data = request.result;
          if (!data || Date.now() - data.timestamp > CACHE_EXPIRATION) {
            // console.log(`GetCachedCount: No valid cache found for ${type}`);
            resolve(null);
          } else {
            // console.log(
            //   `GetCachedCount: Found valid cache for ${type}:`,
            //   data.value
            // );
            resolve(data.value);
          }
        };

        request.onerror = () => {
          console.error(
            `GetCachedCount: Error reading from store for ${type}:`,
            request.error,
          );
          resolve(null);
        };
      } catch (error) {
        console.error(
          `GetCachedCount: Error accessing store for ${type}:`,
          error,
        );
        resolve(null);
      }
    });
  }

  async setCachedCount(
    type: "articles" | "newsletters",
    count: number,
  ): Promise<void> {
    const cacheKey =
      type === "articles"
        ? CACHE_KEYS.ARTICLES_COUNT
        : CACHE_KEYS.NEWSLETTER_COUNT;
    // console.log(`SetCachedCount: Starting for ${type} with count:`, count);

    if (!(await this.ensureInitialized())) return;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(
          [STORE_NAMES.COUNTS],
          "readwrite",
        );
        const store = transaction.objectStore(STORE_NAMES.COUNTS);

        const data = {
          id: cacheKey,
          value: count,
          timestamp: Date.now(),
        };

        const request = store.put(data);

        request.onsuccess = () => {
          //  console.log(
          //   `SetCachedCount: Successfully cached count for ${type}:`,
          //   count
          // );
          resolve();
        };

        request.onerror = () => {
          console.error(
            `SetCachedCount: Error writing to store for ${type}:`,
            request.error,
          );
          resolve();
        };
      } catch (error) {
        console.error(
          `SetCachedCount: Error accessing store for ${type}:`,
          error,
        );
        resolve();
      }
    });
  }

  async getCachedItems(
    type: "articles" | "newsletters" | "featured-posts",
  ): Promise<PostListType[] | null> {
    const storeName =
      type === "newsletters" ? STORE_NAMES.NEWSLETTERS : STORE_NAMES.BLOGS;

    if (!(await this.ensureInitialized())) return null;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(type);

        request.onsuccess = () => {
          const data = request.result;
          if (
            !data ||
            !data.posts ||
            Date.now() - data.timestamp > CACHE_EXPIRATION
          ) {
            // console.log(`GetCachedItems: No valid cache found for ${type}`);
            resolve(null);
          } else {
            const postsLength = data.posts?.length || 0;
            // console.log(
            //   `GetCachedItems: Found valid cache for ${type} with ${postsLength} items`
            // );
            resolve(data.posts);
          }
        };

        request.onerror = () => {
          console.error(
            `GetCachedItems: Error reading from store for ${type}:`,
            request.error,
          );
          resolve(null);
        };
      } catch (error) {
        console.error(
          `GetCachedItems: Error accessing store for ${type}:`,
          error,
        );
        resolve(null);
      }
    });
  }

  async setCachedItems(
    type: "articles" | "newsletters" | "featured-posts",
    posts: PostListType[],
  ): Promise<void> {
    const storeName =
      type === "newsletters" ? STORE_NAMES.NEWSLETTERS : STORE_NAMES.BLOGS;
    // console.log(
    //   `SetCachedItems: Starting for ${type} with ${posts.length} items`
    // );

    if (!(await this.ensureInitialized())) return;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);

        const data = {
          id: type,
          posts: posts,
          timestamp: Date.now(),
        };

        const request = store.put(data);

        request.onsuccess = () => {
          // console.log(
          //   `SetCachedItems: Successfully cached ${posts.length} items for ${type}`
          // );
          resolve();
        };

        request.onerror = () => {
          console.error(
            `SetCachedItems: Error writing to store for ${type}:`,
            request.error,
          );
          resolve();
        };
      } catch (error) {
        console.error(
          `SetCachedItems: Error accessing store for ${type}:`,
          error,
        );
        resolve();
      }
    });
  }
  async getCachedBlogContent(postUrl: string): Promise<PostListType | null> {
    if (!(await this.ensureInitialized())) {
      // console.log("GetCachedBlogContent: Database not initialized");
      return null;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(
          [STORE_NAMES.BLOG_CONTENT],
          "readonly",
        );
        const store = transaction.objectStore(STORE_NAMES.BLOG_CONTENT);
        const request = store.get(postUrl);

        request.onsuccess = () => {
          const data = request.result;
          if (!data || Date.now() - data.timestamp > CACHE_EXPIRATION) {
            // console.log(
            //   `GetCachedBlogContent: No valid cache found for ${postUrl}`
            // );
            resolve(null);
          } else {
            // console.log(
            //   `GetCachedBlogContent: Found valid cache for ${postUrl}`
            // );
            resolve(data.post);
          }
        };

        request.onerror = () => {
          console.error(
            `GetCachedBlogContent: Error reading from store for ${postUrl}:`,
            request.error,
          );
          resolve(null);
        };
      } catch (error) {
        console.error(
          `GetCachedBlogContent: Error accessing store for ${postUrl}:`,
          error,
        );
        resolve(null);
      }
    });
  }

  async setCachedBlogContent(
    postUrl: string,
    post: PostListType,
  ): Promise<void> {
    if (!(await this.ensureInitialized())) {
      // console.log("SetCachedBlogContent: Database not initialized");
      return;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(
          [STORE_NAMES.BLOG_CONTENT],
          "readwrite",
        );
        const store = transaction.objectStore(STORE_NAMES.BLOG_CONTENT);

        const data = {
          id: postUrl,
          post,
          timestamp: Date.now(),
        };

        const request = store.put(data);

        request.onsuccess = () => {
          // console.log(
          //   `SetCachedBlogContent: Successfully cached blog content for ${postUrl}`
          // );
          resolve();
        };

        request.onerror = () => {
          console.error(
            `SetCachedBlogContent: Error writing to store for ${postUrl}:`,
            request.error,
          );
          resolve();
        };
      } catch (error) {
        console.error(
          `SetCachedBlogContent: Error accessing store for ${postUrl}:`,
          error,
        );
        resolve();
      }
    });
  }

  async clearArticlesCache(): Promise<void> {
    if (!(await this.ensureInitialized())) return;

    return new Promise((resolve) => {
      try {
        // Clear articles count cache
        const countsTransaction = this.db!.transaction(
          [STORE_NAMES.COUNTS],
          "readwrite",
        );
        const countsStore = countsTransaction.objectStore(STORE_NAMES.COUNTS);
        countsStore.delete(CACHE_KEYS.ARTICLES_COUNT);

        // Clear articles and featured posts cache
        const blogsTransaction = this.db!.transaction(
          [STORE_NAMES.BLOGS],
          "readwrite",
        );
        const blogsStore = blogsTransaction.objectStore(STORE_NAMES.BLOGS);
        blogsStore.delete("articles");
        blogsStore.delete("featured-posts");

        resolve();
      } catch (error) {
        console.error("ClearArticlesCache: Error clearing caches:", error);
        resolve();
      }
    });
  }

  async clearNewslettersCache(): Promise<void> {
    if (!(await this.ensureInitialized())) return;

    return new Promise((resolve) => {
      try {
        // Clear newsletters count cache
        const countsTransaction = this.db!.transaction(
          [STORE_NAMES.COUNTS],
          "readwrite",
        );
        const countsStore = countsTransaction.objectStore(STORE_NAMES.COUNTS);
        countsStore.delete(CACHE_KEYS.NEWSLETTER_COUNT);

        // Clear newsletters cache
        const newslettersTransaction = this.db!.transaction(
          [STORE_NAMES.NEWSLETTERS],
          "readwrite",
        );
        const newslettersStore = newslettersTransaction.objectStore(
          STORE_NAMES.NEWSLETTERS,
        );
        newslettersStore.delete("newsletters");

        resolve();
      } catch (error) {
        console.error("ClearNewslettersCache: Error clearing caches:", error);
        resolve();
      }
    });
  }

  // Add a convenience method to clear all caches
  async clearAllCaches(): Promise<void> {
    if (!(await this.ensureInitialized())) return;

    return new Promise((resolve) => {
      try {
        // Clear all counts
        const countsTransaction = this.db!.transaction(
          [STORE_NAMES.COUNTS],
          "readwrite",
        );
        const countsStore = countsTransaction.objectStore(STORE_NAMES.COUNTS);
        countsStore.clear();

        // Clear all blogs
        const blogsTransaction = this.db!.transaction(
          [STORE_NAMES.BLOGS],
          "readwrite",
        );
        const blogsStore = blogsTransaction.objectStore(STORE_NAMES.BLOGS);
        blogsStore.clear();

        // Clear all newsletters
        const newslettersTransaction = this.db!.transaction(
          [STORE_NAMES.NEWSLETTERS],
          "readwrite",
        );
        const newslettersStore = newslettersTransaction.objectStore(
          STORE_NAMES.NEWSLETTERS,
        );
        newslettersStore.clear();

        // Clear all blog content
        const blogContentTransaction = this.db!.transaction(
          [STORE_NAMES.BLOG_CONTENT],
          "readwrite",
        );
        const blogContentStore = blogContentTransaction.objectStore(
          STORE_NAMES.BLOG_CONTENT,
        );
        blogContentStore.clear();

        resolve();
      } catch (error) {
        console.error("ClearAllCaches: Error clearing all caches:", error);
        resolve();
      }
    });
  }
}

export const cacheService = new CacheService();
