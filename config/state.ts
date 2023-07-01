import wordlist from '../config/wordlist.json';

export type Character = {
  character: string;
  correct?: boolean;
}

export type Word = {
  characters: Character[];
  startTime?: number;
  endTime?: number;
  wpm?: number;
  hitTargetWPM: boolean;
  match: boolean;
  streak: number;
}

export type State = {
  word: Word;
  level: number;
  highestLevel?: number;
  buffer: string;
  targetWPM: number;
  targetStreak: number;
  finished: boolean;
  lastSave?: number;
  showInstructions: boolean;
}

export const createWord = (raw: string): Word => ({
  characters: raw.toLowerCase().split('').map(character => ({character})),
  match: false,
  hitTargetWPM: false,
  streak: 0,
});

export const defaultLevel = 0;
export const defaultTargetWPM = 90;
export const defaultTargetStreak = 5;

export const initialState: State = {
  word: createWord(wordlist[defaultLevel]),
  level: defaultLevel,
  highestLevel: defaultLevel,
  buffer: '',
  targetWPM: defaultTargetWPM,
  targetStreak: defaultTargetStreak,
  finished: false,
  showInstructions: true,
};

export type Action =  {
  type: 'SAVE_STATE';
} | {
  type: 'LOAD_STATE';
  payload: State;
} | {
  type: 'SET_TARGET_STREAK';
  payload: number;
} | {
  type: 'SET_TARGET_WPM';
  payload: number;
} | {
  type: 'SET_WORD';
  payload: Word;
} | {
  type: 'SET_CHARACTERS';
  payload: Character[];
}| {
  type: 'APPEND_BUFFER';
  payload: string;
} | {
  type: 'BACKSPACE_BUFFER';
} | {
  type: 'NEXT_LEVEL';
} | {
  type: 'JUMP_FORWARDS';
} | {
  type: 'JUMP_BACKWARDS';
} | {
  type: 'JUMP_START';
} | {
  type: 'JUMP_END';
} | {
  type: 'RESET_STATE';
} | {
  type: 'TOGGLE_INSTRUCTIONS';
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SAVE_STATE':
      return {
        ...state,
        lastSave: Date.now(),
      };
    case 'LOAD_STATE':
      return action.payload;
    case 'SET_TARGET_STREAK':
      return {
        ...state,
        targetStreak: action.payload,
        lastSave: Date.now(),
      };
    case 'SET_TARGET_WPM':
      return {
        ...state,
        targetWPM: action.payload,
        lastSave: Date.now(),
      };
    case 'SET_WORD':
      return {
        ...state,
        word: action.payload,
      };
    case 'SET_CHARACTERS':
      return {
        ...state,
        word: {
          ...state.word,
          characters: action.payload,
        },
      };
    case 'APPEND_BUFFER':
      if (state.showInstructions) {
        return state;
      }

      if (state.word.endTime) {
        return state;
      }

      const appendBuffer = state.buffer + action.payload;

      if (appendBuffer.length >= state.word.characters.length) {
        const wpm = Math.round(60 / ((Date.now() - (state.word.startTime ?? 0)) / 1000));
        const match = state.word.characters.every((character, index) => character.character === appendBuffer[index]);
        const hitTargetWPM = wpm >= state.targetWPM;

        return {
          ...state,
          buffer: appendBuffer,
          word: {
            ...state.word,
            endTime: Date.now(),
            streak: hitTargetWPM && match ? state.word.streak + 1 : 0,
            characters: state.word.characters.map((character, index) => ({
              ...character,
              correct: appendBuffer[index] === undefined 
                ? undefined 
                : character.character === appendBuffer[index],
            })),
            wpm,
            match,
            hitTargetWPM,
          },
        };
      }

      return {
        ...state,
        buffer: appendBuffer,
        word: {
          ...state.word,
          startTime: state.word.startTime ?? Date.now(),
          characters: state.word.characters.map((character, index) => ({
            ...character,
            correct: appendBuffer[index] === undefined 
              ? undefined 
              : character.character === appendBuffer[index],
          })),
        },
      };
    case 'BACKSPACE_BUFFER':
      if (state.showInstructions) {
        return state;
      }
      
      if (state.word.endTime) {
        return state;
      }

      const backspaceBuffer = state.buffer.slice(0, -1);

      return {
        ...state,
        buffer: backspaceBuffer,
        word: {
          ...state.word,
          characters: state.word.characters.map((character, index) => ({
            ...character,
            correct: backspaceBuffer[index] === undefined 
              ? undefined 
              : character.character === backspaceBuffer[index],
          })),
        },
      };
    case 'NEXT_LEVEL':
      if (state.showInstructions) {
        return state;
      }
      
      if (state.finished) {
        return state;
      }

      if (state.buffer.length < state.word.characters.length) {
        return {
          ...state,
          word: createWord(wordlist[state.level]),
          buffer: '',
        };
      }

      if (state.word.wpm === undefined) {
        return state;
      }

      if (!state.word.match || state.word.wpm < state.targetWPM) {
        return {
          ...state,
          word: createWord(wordlist[state.level]),
          buffer: '',
        };
      }

      if (state.word.streak < state.targetStreak) {
        return {
          ...state,
          word: {
            ...createWord(wordlist[state.level]),
            streak: state.word.streak,
          },
          buffer: '',
        };
      }

      if (state.level + 1 === wordlist.length) {
        return {
          ...state,
          finished: true,
          lastSave: Date.now(),
        };
      }

      return {
        ...state,
        level: state.level + 1,
        highestLevel: Math.max(state.highestLevel ?? 0, state.level + 1),
        word: createWord(wordlist[state.level + 1]),
        buffer: '',
        lastSave: Date.now(),
      };
    case 'JUMP_FORWARDS':
      if (state.showInstructions) {
        return state;
      }
      
      if (state.highestLevel === undefined) {
        return state;
      }

      const nextLevel = Math.min(state.highestLevel, state.level + 1);

      return {
        ...state,
        level: nextLevel,
        word: createWord(wordlist[nextLevel]),
        buffer: '',
        finished: false,
        lastSave: Date.now(),
      };
    case 'JUMP_BACKWARDS':
      if (state.showInstructions) {
        return state;
      }
      
      if (state.highestLevel === undefined) {
        return state;
      }

      const previousLevel = Math.max(0, state.level - 1);

      return {
        ...state,
        level: previousLevel,
        word: createWord(wordlist[previousLevel]),
        buffer: '',
        finished: false,
        lastSave: Date.now(),
      };
    case 'JUMP_START':
      if (state.showInstructions) {
        return state;
      }
      
      return {
        ...state,
        level: 0,
        word: createWord(wordlist[0]),
        buffer: '',
        finished: false,
        lastSave: Date.now(),
      };
    case 'JUMP_END':
      if (state.showInstructions) {
        return state;
      }
      
      if (state.highestLevel === undefined) {
        return state;
      }

      return {
        ...state,
        level: state.highestLevel,
        word: createWord(wordlist[state.highestLevel]),
        buffer: '',
        finished: false,
        lastSave: Date.now(),
      };
    case 'RESET_STATE':
      return {
        ...initialState,
        lastSave: Date.now(),
      };
    case 'TOGGLE_INSTRUCTIONS':
      return {
        ...state,
        showInstructions: !state.showInstructions,
      };
    default:
      return state;
  }
};