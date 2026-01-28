import { atom } from "recoil";
import type { IdeaType, IdeaStatus } from "@repo/actions";

export const ideasState = atom<IdeaType[]>({
  key: "ideasState",
  default: [],
});

export const currentIdeaState = atom<IdeaType | null>({
  key: "currentIdeaState",
  default: null,
});

export const ideaFilterState = atom<IdeaStatus | "all">({
  key: "ideaFilterState",
  default: "all",
});

export const ideaLoadingState = atom<boolean>({
  key: "ideaLoadingState",
  default: false,
});

export const ideaFormState = atom({
  key: "ideaFormState",
  default: {
    title: "",
    description: "",
    topics: [] as string[],
  },
});

export const generatedOutlineState = atom<string>({
  key: "generatedOutlineState",
  default: "",
});

export const aiGeneratingState = atom<boolean>({
  key: "aiGeneratingState",
  default: false,
});
