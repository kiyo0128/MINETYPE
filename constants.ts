import { WordItem } from './types';

export const GAME_DURATION = 60; // seconds

export const FALLBACK_WORDS: WordItem[] = [
  { japanese: "クリーパー", romaji: "kuri-pa-", category: "MOB" },
  { japanese: "ゾンビ", romaji: "zonbi", category: "MOB" },
  { japanese: "スケルトン", romaji: "sukeruton", category: "MOB" },
  { japanese: "エンダーマン", romaji: "enda-man", category: "MOB" },
  { japanese: "ダイヤモンド", romaji: "daiyamondo", category: "ITEM" },
  { japanese: "作業台", romaji: "sagyoudai", category: "ITEM" },
  { japanese: "たいまつ", romaji: "taimatsu", category: "ITEM" },
  { japanese: "つるはし", romaji: "tsuruhashi", category: "ITEM" },
  { japanese: "ネザー", romaji: "neza-", category: "BIOME" },
  { japanese: "エンド", romaji: "endo", category: "BIOME" },
  { japanese: "レッドストーン", romaji: "reddosuto-n", category: "ITEM" },
  { japanese: "村人", romaji: "murabito", category: "MOB" },
  { japanese: "スティーブ", romaji: "suti-bu", category: "OTHER" },
  { japanese: "アレックス", romaji: "arekkusu", category: "OTHER" },
  { japanese: "ベッド", romaji: "beddo", category: "ITEM" },
];

export const RANK_THRESHOLDS = [
  { score: 0, title: "Dirt Rank", color: "text-amber-800" },
  { score: 500, title: "Wood Rank", color: "text-amber-600" },
  { score: 1000, title: "Stone Rank", color: "text-gray-400" },
  { score: 2000, title: "Iron Rank", color: "text-gray-200" },
  { score: 3500, title: "Gold Rank", color: "text-yellow-400" },
  { score: 5000, title: "Diamond Rank", color: "text-cyan-400" },
  { score: 7000, title: "Netherite Rank", color: "text-purple-400" },
];