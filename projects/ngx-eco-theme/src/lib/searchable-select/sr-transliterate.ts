/**
 * Serbian Cyrillic → Latin transliteration table.
 */
const CYR_TO_LAT: [string, string][] = [
  // Uppercase digraphs
  ['Љ', 'Lj'],
  ['Њ', 'Nj'],
  ['Џ', 'Dž'],
  // Lowercase digraphs
  ['љ', 'lj'],
  ['њ', 'nj'],
  ['џ', 'dž'],
  // Single characters — uppercase
  ['А', 'A'],
  ['Б', 'B'],
  ['В', 'V'],
  ['Г', 'G'],
  ['Д', 'D'],
  ['Ђ', 'Đ'],
  ['Е', 'E'],
  ['Ж', 'Ž'],
  ['З', 'Z'],
  ['И', 'I'],
  ['Ј', 'J'],
  ['К', 'K'],
  ['Л', 'L'],
  ['М', 'M'],
  ['Н', 'N'],
  ['О', 'O'],
  ['П', 'P'],
  ['Р', 'R'],
  ['С', 'S'],
  ['Т', 'T'],
  ['Ћ', 'Ć'],
  ['У', 'U'],
  ['Ф', 'F'],
  ['Х', 'H'],
  ['Ц', 'C'],
  ['Ч', 'Č'],
  ['Ш', 'Š'],
  // Single characters — lowercase
  ['а', 'a'],
  ['б', 'b'],
  ['в', 'v'],
  ['г', 'g'],
  ['д', 'd'],
  ['ђ', 'đ'],
  ['е', 'e'],
  ['ж', 'ž'],
  ['з', 'z'],
  ['и', 'i'],
  ['ј', 'j'],
  ['к', 'k'],
  ['л', 'l'],
  ['м', 'm'],
  ['н', 'n'],
  ['о', 'o'],
  ['п', 'p'],
  ['р', 'r'],
  ['с', 's'],
  ['т', 't'],
  ['ћ', 'ć'],
  ['у', 'u'],
  ['ф', 'f'],
  ['х', 'h'],
  ['ц', 'c'],
  ['ч', 'č'],
  ['ш', 'š'],
];

// Build a single regex that matches any Cyrillic token (digraphs first)
const CYR_REGEX = new RegExp(CYR_TO_LAT.map(([cyr]) => cyr).join('|'), 'g');

const CYR_MAP = new Map<string, string>(CYR_TO_LAT);

/**
 * Converts a Serbian Cyrillic string to Latin.
 * Latin characters are passed through unchanged.
 */
export function cyrToLat(text: string): string {
  return text.replace(CYR_REGEX, match => CYR_MAP.get(match) ?? match);
}

const DIACRITIC_MAP: [RegExp, string][] = [
  [/[čć]/g, 'c'],
  [/[š]/g, 's'],
  [/[ž]/g, 'z'],
  [/[đd]/g, 'd'],
];

export function normalizeForSearch(text: string): string {
  let result = cyrToLat(text).toLowerCase();
  for (const [regex, replacement] of DIACRITIC_MAP) {
    result = result.replace(regex, replacement);
  }
  return result;
}
