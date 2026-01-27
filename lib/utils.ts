import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleFirstName(nameArray: string[]): string {
  const newNameArr = [...nameArray];

  if (newNameArr.length > 1) {
    newNameArr.pop();
  }

  let firstName = "";

  newNameArr.map((item) => {
    firstName = firstName + " " + item;
  });

  return firstName.trim();
}
