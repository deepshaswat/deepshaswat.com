import { atom } from "recoil";
import {
  Member,
  MemberInput,
  PostListType,
  Tags,
  PostStatus,
} from "@repo/actions";

// Content filtering
export const contentTypeState = atom<"blog" | "newsletter">({
  key: "contentTypeState",
  default: "blog",
});

export const postStatusFilterState = atom<PostStatus | "all">({
  key: "postStatusFilterState",
  default: "all",
});

export const selectedTagsFilterState = atom<string[]>({
  key: "selectedTagsFilterState",
  default: [],
});

// Editor state
export const metadataSidebarOpenState = atom<boolean>({
  key: "metadataSidebarOpenState",
  default: true,
});

// SEO fields (separate from postMetadataState for more granular control)
export const metaTitleState = atom<string>({
  key: "metaTitleState",
  default: "",
});

export const metaDescriptionState = atom<string>({
  key: "metaDescriptionState",
  default: "",
});

export const metaKeywordsState = atom<string[]>({
  key: "metaKeywordsState",
  default: [],
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

export const totalMembersState = atom<number>({
  key: "totalMembersState",
  default: 0,
});
