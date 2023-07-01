'use client'

import {useEffect, useReducer, useState, useRef} from "react";
import {useRouter} from 'next/navigation';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import wordlist from '../config/wordlist.json';
import {initialState, reducer} from "@app/config/state";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loadedState, setLoadedState] = useState(false);
  const [lastSaved, setLastSaved] = useState('never');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.match(/^[a-z]$/)) {
        dispatch({type: 'APPEND_BUFFER', payload: e.key});
      }

      if (e.key === 'Backspace') {
        dispatch({type: 'BACKSPACE_BUFFER'});
      }

      if (e.key === ' ' || e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();

        dispatch({type: 'NEXT_LEVEL'});

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        dispatch({type: 'JUMP_BACKWARDS'});
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        dispatch({type: 'JUMP_FORWARDS'});
      }

      if (e.key === 'Home') {
        dispatch({type: 'JUMP_START'});
      }

      if (e.key === 'End') {
        dispatch({type: 'JUMP_END'});
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, []);

  useEffect(() => {
    const isOnLegacyDomain = window.location.hostname === 'descent-typing.vercel.app';

    if (loadedState) {
      localStorage.setItem('state', JSON.stringify(state));
    }

    if (!loadedState) {
      const localStorageState = localStorage.getItem('state');

      if (localStorageState) {
        const state = JSON.parse(localStorageState);
        const payload = {
          ...initialState,
          ...state,
          highestLevel: state.highestLevel ?? state.level,
          showInstructions: state.showInstructions ?? true,
          lastSave: Date.now(),
        };

        if (isOnLegacyDomain) {
          const base64State = btoa(JSON.stringify({
            level: payload.level,
            highestLevel: payload.highestLevel,
            targetWPM: payload.targetWPM,
            targetStreak: payload.targetStreak,
          }));

          localStorage.removeItem('state');

          router.push(`https://www.burst-type.pro/migrate?s=${base64State}`);
        }

        dispatch({type: 'LOAD_STATE', payload});
      } else {
        if (isOnLegacyDomain) {
          router.push('https://www.burst-type.pro/');
        }

        dispatch({type: 'LOAD_STATE', payload: {
          ...initialState,
          lastSave: Date.now(),
        }});
      }

      setLoadedState(true);
    }
  }, [loadedState, state.lastSave]);

  useEffect(() => {
    setLastSaved(timeAgo.format(state.lastSave ?? 0));

    const interval = setInterval(() => {
      setLastSaved(timeAgo.format(state.lastSave ?? 0));
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [state.lastSave]);

  const handleReset = () => {
    if (!confirm('Are you sure you want to reset your progress?')) {
      return;
    }

    dispatch({type: 'RESET_STATE'})
  };

  const handleSave = () => {
    dispatch({type: 'SAVE_STATE'});

    alert('Your progress and settings have been saved!');
  };

  if (!loadedState) {
    return (
      <main className="flex items-center justify-center w-full h-screen bg-neutral-900 text-neutral-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 stroke-yellow-400 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center w-full h-screen bg-neutral-900 text-neutral-600">
      {state.finished ? (
        <div className="text-center">
          <p className="text-8xl">🎉</p>
          <h1 className="mt-6 text-8xl font-bold text-neutral-50">Congrats!</h1>
          <p className="mt-8 text-xl font-bold text-neutral-100">You have completed the entire word list.</p>
          <p className="text-neutral-400">Use your arrow keys to move through the wordlist and continue practicing.</p>
        </div>
      ) : (
        <div className="text-center">
        <p className="text-9xl font-bold tracking-wider">
          {state.word.characters.map((character, index) => (
            <span key={index} className={`${character.correct === undefined ? 'text-neutral-600' : character.correct ? 'text-neutral-50' : 'text-red-600'}`}>
              {character.character}
            </span>
          ))}
          <input ref={inputRef} className="sr-only" type="text"/>
        </p>
        <p className={`text-3xl mt-6 ${state.word.wpm === undefined ? 'text-neutral-600' : state.word.match && state.word.wpm >= state.targetWPM ? 'text-green-600' : 'text-red-600'} ${state.word.startTime !== undefined && state.word.wpm === undefined ? 'italic animate-pulse' : ''}`}>
          {state.word.wpm !== undefined ? `${state.word.wpm} WPM` : state.word.startTime === undefined ? 'Ready' : '>>> GO >>>'}
        </p>
        <div className="flex flex-wrap gap-1 justify-center mt-4 -skew-y-12 rotate-12">
          {Array.from({length: state.targetStreak}).map((_, index) => (
            <div key={index} className={`w-4 h-4 ${state.word.wpm !== undefined && (!state.word.match || state.word.wpm < state.targetWPM) ? 'bg-red-600' : index < state.word.streak ? 'bg-green-600' : 'bg-neutral-700'}`}/>
          ))}
        </div>
      </div>
      )}
      <div className="fixed flex justify-center top-0 right-0 w-full p-10">
        <div className="relative inline-flex flex-wrap justify-center items-center gap-4 mx-auto">
          {[30, 60, 90, 120, 200, 500, 1000].map((wpm, index) => (
            <button
              key={index}
              type="button"
              className={`flex flex-col items-center w-16 py-3 border-2 rounded-md ${wpm === state.targetWPM ? 'border-green-500 text-green-400 bg-green-950 shadow-md shadow-green-800' : 'border-neutral-700 text-neutral-400'} hover:border-green-500 hover:text-green-400`}
              onClick={() => dispatch({type: 'SET_TARGET_WPM', payload: wpm})}
            >
              <span className="font-bold text-lg">{wpm}</span>
              <span className="text-xs uppercase opacity-60">WPM</span>
            </button>
          ))}
          <div className="h-10 border-l-2 border-neutral-800 mx-4"/>
          {[1, 3, 5, 10, 25].map((streak, index) => (
            <button
              key={index}
              type="button"
              className={`flex flex-col items-center w-16 py-3 border-2 rounded-md ${streak === state.targetStreak ? 'border-sky-400 text-sky-400 bg-sky-950 shadow-md shadow-sky-800' : 'border-neutral-700 text-neutral-400'} hover:border-sky-400 hover:text-sky-400`}
              onClick={() => dispatch({type: 'SET_TARGET_STREAK', payload: streak})}
            >
              <span className="font-bold text-lg">{streak}</span>
              <span className="text-xs uppercase opacity-60">Streak</span>
            </button>
          ))}
          <div className="h-10 border-l-2 border-neutral-800 mx-4"/>
          <button
            type="button"
            className="flex flex-col items-center w-16 py-3 border-2 border-neutral-700 text-neutral-400 hover:border-green-500 hover:bg-green-950 hover:text-green-400 hover:shadow-md hover:shadow-green-800 rounded-md"
            onClick={handleSave}
          >
            <span className="font-bold text-lg">S</span>
            <span className="text-xs uppercase opacity-60">Save</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center w-16 py-3 border-2 border-neutral-700 text-neutral-400 hover:border-red-500 hover:bg-red-950 hover:text-red-400 hover:shadow-md hover:shadow-red-800 rounded-md"
            onClick={handleReset}
          >
            <span className="font-bold text-lg">R</span>
            <span className="text-xs uppercase opacity-60">Reset</span>
          </button>
          <div className="absolute h-4 bottom-0 -mb-8 w-full border-l-2 border-b-2 border-r-2 border-neutral-800 rounded-b-md text-center">
            <span className="absolute bottom-0 left-[50%] -translate-x-[50%] bg-neutral-900 -mb-3 px-3 font-bold uppercase text-sm">options</span>
          </div> 
        </div>
      </div>
      <div className="fixed flex justify-center bottom-0 w-full px-10 pb-20">
        <div className="relative inline-flex flex-wrap gap-0.5 max-w-[750px] justify-center mx-auto">
          {wordlist.map((_, index) => (
            <div key={index} className={`w-1 h-1 ${index === state.level ? 'bg-neutral-100 animate-pulse' : index < state.level ? 'bg-green-500' : index <= (state.highestLevel ?? 0) ? 'bg-green-900' : 'bg-neutral-800'}`}/>
          ))}
          <div className="absolute h-4 bottom-0 -mb-8 w-full border-l-2 border-b-2 border-r-2 border-neutral-800 rounded-b-md text-center">
            <span className="flex items-center gap-2 absolute top-0 left-[50%] -translate-x-[50%] bg-neutral-900 -mb-5 px-3 text-neutral-600 text-sm font-bold uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5">
                <path fillRule="evenodd" d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.25 6a.75.75 0 00-1.5 0v4.94l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V9.75z" clipRule="evenodd" />
              </svg>
              <span className="mt-1.5">
                {`Saved ${lastSaved}`}
              </span>
            </span>
          </div>
          <div className="absolute h-4 top-0 -mt-8 w-full border-l-2 border-t-2 border-r-2 border-neutral-800 rounded-t-md text-center">
            <span className="absolute top-0 left-[50%] -translate-x-[50%] bg-neutral-900 -mt-2.5 px-3 font-bold uppercase text-sm">{`Words discovered (${(state.highestLevel ?? 0) + 1}/${wordlist.length})`}</span>
          </div>
        </div>
      </div>
      {state.showInstructions && (
        <div className="fixed inset-0 flex justify-center items-center bg-neutral-900 bg-opacity-70 backdrop-blur-md">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 stroke-yellow-400 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
            <h1 className="mt-6 text-7xl font-bold text-neutral-50">BurstType<span className="text-blue-500">Pro</span></h1>
            <p className="mt-16 text-neutral-400 max-w-3xl mx-auto">Set your desired min <span className="text-green-400">WPM</span> and <span className="text-sky-400">streak</span> count, then type the word you see on the screen. If you complete the word with no mistakes (and at or above your min WPM setting), your streak will increase; otherwise, your streak will reset.</p>
            <p className="mt-4 text-neutral-400 max-w-3xl mx-auto">Pressing the <span className="bg-neutral-400 text-neutral-950 font-bold px-2 py-0.5 rounded-md">spacebar</span> after you have started typing a word will reset the word and your streak. Pressing the <span className="bg-neutral-400 text-neutral-950 font-bold px-2 py-0.5 rounded-md">spacebar</span> after you have successfully completed a word/streak will unlock (discover) the next word in the list.</p>
            <p className="mt-4 text-neutral-400 max-w-3xl mx-auto">You can use the <span className="bg-neutral-400 text-neutral-950 font-bold px-2 py-0.5 rounded-md">left/down</span> or <span className="bg-neutral-400 text-neutral-950 font-bold px-2 py-0.5 rounded-md">right/up</span> arrow keys to move backwards and forwards through your discovered words. Jump to back to the start or to your latest discovered word using the <span className="bg-neutral-400 text-neutral-950 font-bold px-2 py-0.5 rounded-md">home</span> or <span className="bg-neutral-400 text-neutral-950 font-bold px-2 py-0.5 rounded-md">end</span> keys.</p>
            <button className="mt-16 bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded-md shadow-md shadow-green-800" type="button" onClick={() => dispatch({type: 'TOGGLE_INSTRUCTIONS'})}>Get Started!</button>
          </div>
        </div>
      )}
    </main>
  )
}
