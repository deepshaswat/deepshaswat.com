import { atom } from "recoil";
import { Member, MemberInput, PostListType, Tags } from "@repo/actions";

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
    tags: [] as Tags[],
    authors: "",
  },
});

export const selectDate = atom<Date>({
  key: "selectDate",
  default: new Date(),
});

export const selectedTimeIst = atom<string>({
  key: "selectedTimeIst",
  default: "23:00",
});

export const postIdState = atom<string | null>({
  key: "postIdState",
  default: null,
});

export const postDataState = atom<PostListType | null>({
  key: "postDataState",
  default: null,
});

export const errorDuplicateUrlState = atom<string | null>({
  key: "errorDuplicateUrlState",
  default: null,
});

export const tagsState = atom<Tags[]>({
  key: "tagsState",
  default: [],
});

export const selectedTagsState = atom<Tags[]>({
  key: "selectedTagsState",
  default: [],
});

export const pageNumberState = atom<number>({
  key: "pageNumberState",
  default: 0,
});

export const savePostErrorState = atom<string | null>({
  key: "savePostErrorState",
  default: null,
});

export const blogPageNumberState = atom<number>({
  key: "blogPageNumberState",
  default: 0,
});

export const memberState = atom<Member | null>({
  key: "memberState",
  default: null,
});
