import { userAtom } from "@/atoms/yoon";
import { MyPageInput } from "@/components/mypage/MyPageInput";
import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useState } from "react";

export const Route = createFileRoute("/mypage/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useAtom(userAtom);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const navigation = useNavigate();

  const onClick = () => {
    setUser({ email: email, name: name, age: Number(age) });

    navigation({ to: "/mypage" });
  };

  return (
    <div className="flex flex-col w-full gap-y-5 justify-center items-center">
      <MyPageInput
        inputName="이메일"
        inputState={email}
        setInputState={setEmail}
      />

      <MyPageInput inputName="이름" inputState={name} setInputState={setName} />

      <MyPageInput inputName="나이" inputState={age} setInputState={setAge} />

      <div className="flex justify-center">
        <Button className="w-[20rem]" onClick={onClick}>
          확인
        </Button>
      </div>
    </div>
  );
}
