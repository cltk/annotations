import * as GreekProsody from './GreekProsody'

describe('GreekProsody', () => {
  describe('.cleanText()', () => {
    it('removes accentuation', () => {
      const text = 'μῆνιν ἄειδε θεὰ πηληϊάδεω ἀχιλῆος'
      const cleaned = GreekProsody.cleanText(text)

      expect(cleaned).toEqual('μηνιν αειδε θεα πηληϊαδεω αχιληος')
    })

    it('lowercases the text', () => {
      const text = 'ΑΒΓ'

      expect(GreekProsody.cleanText(text)).toEqual('αβγ')
    })
  })

  describe('.syllablize()', () => {
    it('splits a sentence into an array of 3-tuples of {syllable, start, end}', () => {
      const text = GreekProsody.cleanText('μῆνιν ἄειδε θεὰ πηληϊάδεω ἀχιλῆος')
      const syllables = GreekProsody.syllablize(text)

      expect(syllables).toEqual([
        ['μη', 0, 2],
        ['νι', 2, 4],
        ['ν α', 4, 7],
        ['ει', 7, 9],
        ['δε', 9, 11],
        [' θε', 11, 14],
        ['α', 14, 15],
        [' πη', 15, 18],
        ['λη', 18, 20],
        ['ϊ', 20, 21],
        ['α', 21, 22],
        ['δε', 22, 24],
        ['ω', 24, 25],
        [' α', 25, 27],
        ['χι', 27, 29],
        ['λη', 29, 31],
        ['ος', 31, 32]
      ])
    })
  })

  describe('.isLongByNature()', () => {
    it('returns `true` for a long vowel', () => {
      expect(GreekProsody.isLongByNature('η')).toBe(true)
    })

    it('returns `true` for a diphthong', () => {
      expect(GreekProsody.isLongByNature('ει')).toBe(true)
    })

    it('returns `false` for a short vowel', () => {
      expect(GreekProsody.isLongByNature('ε')).toBe(false)
    })
  })

  describe('.isLongByPosition()', () => {
    it('returns `true` for a vowel followed by a double consonant', () => {
      expect(GreekProsody.isLongByPosition('ε', 'ξ')).toBe(true)
    })

    it('returns `true` for a vowel followed by two single consonants', () => {
      expect(GreekProsody.isLongByPosition('εκ', 'κ')).toBe(true)
    })

    it('returns `true` if the next syllable begins with a non-stop consonant followed by a non-liquid consonant', () => {
      expect(GreekProsody.isLongByPosition('', 'ρκ')).toBe(true)
    })

    it('returns `false` if there is no next syllable', () => {
      expect(GreekProsody.isLongByPosition('')).toBe(false)
    })

    it('returns `false` if none of the other conditions matches', () => {
      expect(GreekProsody.isLongByPosition('ε', 'πλ')).toBe(false)
    })
  })
})
