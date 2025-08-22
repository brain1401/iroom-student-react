import type { Dispatch} from "react";
import { Input } from "../ui/input";
import type { SetStateAction } from "jotai";

type Props = {
  inputName: string;
  inputState: string;
  setInputState: Dispatch<SetStateAction<string>>;
};

export function MyPageInput({ inputName, inputState, setInputState }: Props) {

  return (
    <div className="flex w-[20rem] items-center gap-x-5">
      <div className="text-[1.4rem]">{inputName}</div>
      <Input
        value={inputState}
        onChange={(e) => setInputState(e.target.value)}
        className="border-zinc-600 flex-1"
      />
    </div>
  );
}
