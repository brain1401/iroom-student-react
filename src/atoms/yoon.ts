import { atom } from "jotai";

type User = {
    name : string,
    email : string
    age : number
}


// const person: User = {
//     email: "seses@sdsd.com",
//     name: "홍태극",
//     age: 30
// }



export const userAtom = atom<User>({
    email: "seses@sdsd.com",
    name: "홍태극",
    age: 30
})
