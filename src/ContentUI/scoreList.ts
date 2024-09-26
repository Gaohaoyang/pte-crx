export const scoreList = [
  {
    clb: 10,
    pteReading: [88, 90],
    pteWriting: [90],
    pteListening: [89, 90],
    pteSpeaking: [89, 90],
    ieltsReading: 8.0,
    ieltsWriting: 7.5,
    ieltsListening: 8.5,
    ieltsSpeaking: 7.5,
  },
  {
    clb: 9,
    pteReading: [78, 87],
    pteWriting: [88, 89],
    pteListening: [82, 88],
    pteSpeaking: [84, 88],
    ieltsReading: 7.0,
    ieltsWriting: 7.0,
    ieltsListening: 8.0,
    ieltsSpeaking: 7.0,
  },
  {
    clb: 8,
    pteReading: [69, 77],
    pteWriting: [79, 87],
    pteListening: [71, 81],
    pteSpeaking: [76, 83],
    ieltsReading: 6.5,
    ieltsWriting: 6.5,
    ieltsListening: 7.5,
    ieltsSpeaking: 6.5,
  },
  {
    clb: 7,
    pteReading: [60, 68],
    pteWriting: [69, 78],
    pteListening: [60, 70],
    pteSpeaking: [68, 75],
    ieltsReading: 6.0,
    ieltsWriting: 6.0,
    ieltsListening: 6.0,
    ieltsSpeaking: 6.0,
  },
  {
    clb: 6,
    pteReading: [51, 59],
    pteWriting: [60, 68],
    pteListening: [50, 59],
    pteSpeaking: [59, 67],
    ieltsReading: 5.0,
    ieltsWriting: 5.5,
    ieltsListening: 5.5,
    ieltsSpeaking: 5.5,
  },
  {
    clb: 5,
    pteReading: [42, 50],
    pteWriting: [51, 59],
    pteListening: [39, 49],
    pteSpeaking: [51, 58],
    ieltsReading: 4.0,
    ieltsWriting: 5.0,
    ieltsListening: 5.0,
    ieltsSpeaking: 5.0,
  },
  {
    clb: 4,
    pteReading: [33, 41],
    pteWriting: [41, 50],
    pteListening: [28, 38],
    pteSpeaking: [42, 50],
    ieltsReading: 3.5,
    ieltsWriting: 4.0,
    ieltsListening: 4.5,
    ieltsSpeaking: 4.0,
  },
]

export const clbEEScore = {
  clb10: {
    withoutSpouse: 34,
    withSpouse: 32,
    asSpouse: 5,
  },
  clb9: {
    withoutSpouse: 31,
    withSpouse: 29,
    asSpouse: 5,
  },
  clb8: {
    withoutSpouse: 23,
    withSpouse: 22,
    asSpouse: 3,
  },
  clb7: {
    withoutSpouse: 17,
    withSpouse: 16,
    asSpouse: 3,
  },
  clb6: {
    withoutSpouse: 9,
    withSpouse: 8,
    asSpouse: 1,
  },
  clb5: {
    withoutSpouse: 6,
    withSpouse: 6,
    asSpouse: 1,
  },
  clb4: {
    withoutSpouse: 0,
    withSpouse: 0,
    asSpouse: 0,
  },
}

export const getEqualScores = (
  scoreValue: string,
  type: 'Listening' | 'Speaking' | 'Reading' | 'Writing',
) => {
  const scoreValueNum = Number(scoreValue)
  const resultItem = scoreList.find((item) => {
    const pteTypeScore = item[`pte${type}`]
    if (pteTypeScore.length > 1) {
      return (
        scoreValueNum <= pteTypeScore[1] && scoreValueNum >= pteTypeScore[0]
      )
    } else {
      return scoreValueNum === pteTypeScore[0]
    }
  })
  return resultItem
}

const RA = 'RA'
const RS = 'RS'
const DI = 'DI'
const RTS = 'RTS'
const ASQ = 'ASQ'
const SWT = 'SWT'
const WE = 'WE'

const FIBRW = 'FIB-RW'
const MCMRW = 'MCM-RW'
const RO = 'RO'
const FIBR = 'FIB-R'
const MCSR = 'MCS-R'

const SST = 'SST'
const MCML = 'MCM-L'
const FIBL = 'FIB-L'
const MCSL = 'MCS-L'
const SMW = 'SMW'
const HIW = 'HIW'
const WFD = 'WFD'

export const skillsAnalysis = {
  openResponseSpeakingWriting: {
    component: [WE, DI, RTS],
    support: ['Speaking', 'Writing'],
  },
  reproducingSpokenWrittenLanguage: {
    component: [WFD, RA, RS, SST],
    support: ['Speaking', 'Writing'],
  },
  writingExtended: { component: [WE, SST, SWT], support: ['Writing'] },
  writingShort: { component: [WFD, FIBRW, FIBL], support: ['Writing'] },
  speakingExtended: { component: [DI, RTS], support: ['Speaking'] },
  speakingShort: { component: [RA, RS, ASQ], support: ['Speaking'] },
  multipleSkillsComprehension: {
    component: [FIBRW, SST, WFD, RA, RS, SWT, HIW],
    support: ['Listening', 'Reading'],
  },
  singleSkillComprehension: {
    component: [RO, FIBR, MCMRW, MCSR, MCML, MCSL, SMW],
    support: ['Listening', 'Reading'],
  },
}
