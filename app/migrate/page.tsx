'use client'

import {useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {useRouter} from 'next/navigation';
import {createWord, initialState} from "@app/config/state";
import wordlist from '../../config/wordlist.json';

export default function Migrate() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const localStorageState = localStorage.getItem('state');

    if (localStorageState) {
      router.push("/");
      return;
    }

    const s = params.get("s");

    if (s) {
      const data = JSON.parse(atob(s));
      const state = {
        ...initialState,
        ...data,
        word: createWord(wordlist[data.level ?? 0]),
      }
      
      localStorage.setItem("state", JSON.stringify(state));
      router.push("/");
    }
  }, []);

  return (
    <main className="flex items-center justify-center w-full h-screen bg-neutral-900 text-neutral-200">
      <h1>Migrating your saved progress, please wait...</h1>
    </main>
  )
}