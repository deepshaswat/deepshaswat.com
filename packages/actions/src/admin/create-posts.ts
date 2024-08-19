import prisma from "@repo/db/client";

async function createPost(data: FormData) {
  const title = data.get("title")?.toString() || "";
  const content = data.get("content")?.toString() || "";
  const postUrl = data.get("postUrl")?.toString() || "";
  const publishDate = data.get("publishDate")?.toString() || "";
  const excerpt = data.get("excerpt")?.toString() || "";
  const tags = data.getAll("tags").map((tag) => tag.toString());
  const authors = data.getAll("authors").map((author) => author.toString());
  const featured = data.get("featured") === "on";

  await prisma.post.create({
    data: {
      title,
      content,
      postUrl,
      publishDate: new Date(publishDate),
      excerpt,
      featured,
      tags: {
        connect: tags.map((id) => ({ id })),
      },
      authors: {
        connect: authors.map((id) => ({ id })),
      },
    },
  });
}

export { createPost };
