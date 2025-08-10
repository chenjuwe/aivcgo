import surnames from './data/surnames_tw.json';
import unisex from './data/given_chars_unisex.json';
import bigrams from './data/given_bigrams_tw.json';
import phonetics from './data/char_phonetics.json';
import cantonese from './data/cantonese_phonetics.json';
import homophone from './data/homophone_blacklist.json';
import { configureNameData, WeightedSurname, WeightedChar, Bigram } from './nameGenerator';

export function initNameData() {
  configureNameData({
    surnames: surnames as unknown as WeightedSurname[],
    givenUnisex: unisex as unknown as WeightedChar[],
    bigrams: bigrams as unknown as Bigram[],
    phonetics: phonetics as any,
    cantonese: cantonese as any,
    homophoneBlacklist: homophone as any,
  });
} 