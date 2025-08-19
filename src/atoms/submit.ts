import { atom } from "jotai";

type Submit = {
  title: string;
  range: string;
  teacher: string;
  deadline: string;
  content: string;
  submitted: boolean;
};

export const submitAtom = atom<Submit>({
  title: "",
  range: "",
  teacher: "",
  deadline: "",
  content: "",
  submitted: false,
});