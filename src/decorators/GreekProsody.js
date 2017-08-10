// @flow

import flatten from 'lodash.flatten'
import zip from 'lodash.zip'

const SHORT = '˘'
const LONG = '¯'

const vowels = [
  'ε', 
  'ι', 
  'ο', 
  'α', 
  'η', 
  'ω', 
  'υ', 
  'ῖ', 
  'ᾶ'
]

const singleConsonants = [
  'ς', 
  'ρ', 
  'τ', 
  'θ', 
  'π', 
  'σ', 
  'δ', 
  'φ', 
  'γ', 
  'ξ',
  'κ', 
  'λ', 
  'χ', 
  'β', 
  'ν', 
  'μ'
]

const doubleConsonants = [
  'ξ', 
  'ζ', 
  'ψ'
]

const longVowels = [
  'η', 
  'ω', 
  'ῖ', 
  'ᾶ', 
  'ῦ'
]

const diphthongs = [
  'αι', 
  'αῖ', 
  'ευ', 
  'εῦ', 
  'αυ', 
  'αῦ', 
  'οι', 
  'οῖ',
  'ου', 
  'οῦ', 
  'ει', 
  'εῖ', 
  'υι', 
  'υῖ', 
  'ηῦ'
]

const stopConsonants = [
  'π',
  'τ',
  'κ',
  'β', 
  'δ', 
  'γ'
]

const liquids = ['ρ', 'λ']

const punctuation = /\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\=|\+|\[|\]|\{|\}|[0-9]|\'|\`|\᾽|\（|\）/ig 
const stops = /\·|\:|\;|\,/ig

const accents = {
  'ὲέἐἑἒἓἕἔ': 'ε',
  'ὺύὑὐὒὓὔὕ': 'υ',
  'ὸόὀὁὂὃὄὅ': 'ο',
  'ὶίἰἱἲἳἵἴ': 'ι',
  'ὰάἁἀἂἃἅἄᾳᾂᾃ': 'α',
  'ὴήἠἡἢἣἥἤἧἦῆῄῂῇῃᾓᾒᾗᾖᾑᾐ': 'η',
  'ὼώὠὡὢὣὤὥὦὧῶῲῴῷῳᾧᾦᾢᾣᾡᾠ': 'ω',
  'ἶἷ': 'ῖ',
  'ἆἇᾷᾆᾇ': 'ᾶ',
  'ὖὗ': 'ῦ',
}
  
export const cleanText = (text: string): string => {
  const keys = Object.keys(accents)
  const l = keys.length

  return text.replace(punctuation, '')
    .replace(stops, '.')
    .split('')
    .map(c => {
      for (let i = 0; i < l; i++) {
        if (keys[i].includes(c)) {
          return accents[keys[i]]
        }
      }
      
      return c
    }).join('').toLowerCase()
}

export const syllablize = (word: string): Array<string> => {
  let lastIndex = 0

  return word.split('').reduce((syllables, currentLetter, index) => {
    if (index < lastIndex) {
      return syllables
    }

    if (diphthongs.includes(`${currentLetter}${word[index + 1]}`)) {
      const substr = word.substring(lastIndex, index + 2)

      lastIndex = index + 2

      return syllables.concat(substr)    
    }

    if (vowels.includes(currentLetter) || longVowels.includes(currentLetter)) {
      const substr = word.substring(lastIndex, index + 1)

      lastIndex = index + 1

      return syllables.concat(substr)
    }
    
    // add trailing consonants to final syllable
    if (index === word.length - 1 && lastIndex <= word.length - 1) {
      syllables[syllables.length - 1] = `${syllables[syllables.length - 1]}${word.substring(lastIndex)}`

      return syllables
    }

    return syllables
  }, [])
}

export const isLongByNature = (syllable: string): boolean => {
  for (let i = 0, l = syllable.length; i < l; i++) {
    if (longVowels.includes(syllable[i])) {
      return true
    }

    if (diphthongs.includes(`${syllable[i]}${syllable[i + 1]}`)) {
      return true
    }
  }

  return false
}

export const isLongByPosition = (syllable: string, nextSyllable: string): boolean => {
  if (!nextSyllable) {
    return false
  }

  if (vowels.includes(syllable.substr(-1)) &&
      doubleConsonants.includes(nextSyllable[0])) {
    return true
  }

  if (singleConsonants.includes(syllable.substr(-1)) &&
      singleConsonants.includes(nextSyllable[0])) {
    return true
  }

  if (singleConsonants.includes(nextSyllable[0]) && 
      singleConsonants.includes(nextSyllable[1]) &&
      !stopConsonants.includes(nextSyllable[0]) &&
      !liquids.includes(nextSyllable[1])) {
    return true
  }
  return false
}

export const isLong = (syllable: string, nextSyllable: string): boolean => (
  isLongByNature(syllable) || 
  isLongByPosition(syllable, nextSyllable)
)

export const scan = (sentence: Array<string>): Array<string> => sentence.map((syllable, index) => {
  return isLong(syllable, sentence[index + 1]) ? LONG : SHORT
})

export const processText = (text: string): Array<Array<string>> => {
  const unaccentedText = cleanText(text)
  const sentences = unaccentedText.split('.')
  const wordsInSentences = sentences.map(s => s.split(' '))
  const syllablizedSentences = wordsInSentences.map(s => flatten(s.map(w => syllablize(w))))
  const scannedSentences = syllablizedSentences.map(s => scan(s))
  
  return zip(syllablizedSentences, scannedSentences)
}

export default processText
