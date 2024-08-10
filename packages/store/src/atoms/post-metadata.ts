import { atom } from "recoil";

export const selectDate = atom<Date>({
  key: "selectDate",
  default: new Date(),
});

export const sidebarUrl = atom<String>({
  key: "sidebarUrl",
  default: "",
});

export const inputTimeIst = atom<String>({
  key: "inputTimeIst",
  default: "",
});
