// @flow

import React from 'react'
import type { ContentState } from 'draft-js'

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

const punctuation = /!|@|#|\$|%|\^|&|\*|\(|\)|-|_|=|\+|\[|\]|\{|\}|[0-9]|'|`|᾽|（|）/ig
const stops = /·|:|;|,/ig

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

  return text.toLowerCase()
    .split('')
    .map(c => {
      for (let i = 0; i < l; i++) {
        if (keys[i].includes(c)) {
          return accents[keys[i]]
        }
      }

      return c
    }).join('')
}

export const syllablize = (sentence: string): Array<[
  string,
  number,
  number
]> => {
  let lastIndex = 0

  return sentence.split('').reduce((syllables, currentLetter, index) => {
    if (index < lastIndex) {
      return syllables
    }

    if (stops.test(currentLetter) || punctuation.test(currentLetter)) {
      return syllables
    }

    if (diphthongs.includes(`${currentLetter}${sentence[index + 1]}`)) {
      const substr = sentence.substring(lastIndex, index + 2)
      const nextEl = [substr, lastIndex, index === 0 ? index + 2 : index]

      lastIndex = index + 2

      return [...syllables, nextEl]
    }

    if (vowels.includes(currentLetter) || longVowels.includes(currentLetter)) {
      const substr = sentence.substring(lastIndex, index + 1)
      const nextEl = [substr, lastIndex, index === 0 ? index + 1 : index]

      lastIndex = index + 1

      return [...syllables, nextEl]
    }

    // add trailing consonants to final syllable
    if (index === sentence.length - 1 && lastIndex <= sentence.length - 1) {
      syllables[syllables.length - 1][0] =
        `${syllables[syllables.length - 1][0]}${sentence.substring(lastIndex)}`

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

  nextSyllable = nextSyllable.replace(/\s/ig, '')

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

export const scan = (syllable: string, nextSyllable: string): string => {
  return isLong(
    syllable.replace(/\s/ig, ''),
    nextSyllable.replace(/\s/ig, '')
  ) ? LONG : SHORT
}

export const processText = (text: string): Array<{
  diacritic: string,
  offset: number,
  length: number,
}> => {
  const unaccentedText = cleanText(text)
  const syllables = syllablize(unaccentedText)

  return syllables.map((s, i) => {
    return {
      diacritic: scan(s[0], syllables[i + 1] && syllables[i + 1][0] || ''),
      offset: s[1],
      length: s[2] - s[1],
    }
  })
}

type Props = {
  children: Object,
  contentState: ContentState,
  entityKey: string
}

const style = {
  diacritic: {
    position: 'absolute',
    textAlign: 'center',
    top: -4,
    width: '100%',
  },
  text: {
    display: 'inline-block',
    letterSpacing: 0.5,
    paddingBottom: 4,
    paddingTop: 2,
    position: 'relative',
  }
}

const GreekProsody = (props: Props) => {
  const entity = props.contentState.getEntity(props.entityKey)
  const { diacritic } = entity.getData()
  return (
    <div style={style.text}>
      {props.children}
      <span style={style.diacritic}>{diacritic}</span>
    </div>
  )
}

export default GreekProsody
