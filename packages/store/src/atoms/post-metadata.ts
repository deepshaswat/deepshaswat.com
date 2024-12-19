import { atom } from "recoil";

export const selectDate = atom<Date>({
  key: "selectDate",
  default: new Date(),
});

export const postMetadataState = atom({
  key: "postMetadataState",
  default: {
    title: "",
    description: "",
    imageUrl: "",
    keywords: "",
    authorName: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  },
});

export const postState = atom({
  key: "postState",
  default: {
    title: "",
    content: "",
    featureImage: "",
    postUrl: "",
    publishDate: null as Date | null,
    excerpt: "",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    socialImage: "",
  },
});

export const selectedTagsState = atom<string[]>({
  key: "selectedTagsState",
  default: [],
});

export const selectedTimeIst = atom<string>({
  key: "selectedTimeIst",
  default: "23:00",
});
