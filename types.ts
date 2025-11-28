export interface WordItem {
  japanese: string;
  romaji: string;
  category: 'MOB' | 'ITEM' | 'BIOME' | 'OTHER';
}

export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface GameStats {
  score: number;
  correctChars: number;
  missedChars: number;
  maxCombo: number;
}