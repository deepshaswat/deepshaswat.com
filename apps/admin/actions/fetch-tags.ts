export async function fetchTagDetails(slug: string) {
  // ToDo: Replace with actual data fetching logic
  const tags = [
    {
      slug: "articles",
      name: "Articles",
      description: "This is the first post.",
      imageUrl:
        "https://blog-deepshaswat-readonly.s3.amazonaws.com/5cab588e-9ac7-4b0c-b7fb-8cb7e9de1507.png",
    },
    {
      slug: "book-notes",
      name: "Book Notes",
      description: "This is the first post.",
      imageUrl:
        "https://blog-deepshaswat-readonly.s3.amazonaws.com/a7f38267-a0a8-4711-821b-2698a48542b1.png",
    },
  ];
  return tags.find((tag) => tag.slug === slug) || null;
}
