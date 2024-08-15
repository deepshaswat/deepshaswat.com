export async function fetchTagDetails(slug: string) {
  // ToDo: Replace with actual data fetching logic
  const tags = [
    {
      slug: "articles",
      name: "Articles",
      description: "This is the first post.",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      slug: "book-notes",
      name: "Book Notes",
      description: "This is the first post.",
      imageUrl: "https://via.placeholder.com/150",
    },
  ];
  return tags.find((tag) => tag.slug === slug) || null;
}
