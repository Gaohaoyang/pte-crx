export interface PTEDataType {
  gender: string
  testDate: string
  candidateId: string
  appointmentId: string
  middleName: null
  countryOfResidence: string
  reportIssueDate: string
  testCenter: string
  testCenterId: string
  testCenterCountry: string
  hasPhoto: boolean
  enablingSkills: null
  countryOfCitizenShip: string
  institutionCode: null
  institutionName: null
  scoreReportNumber: string
  isRevoked: boolean
  revokedStatusChangeDate: string
  examSeriesCode: string
  ukviNumber: null
  admissioinId: string
  idNumber: string
  countryIssuanceId: string
  isExpired: boolean
  isNoShow: boolean
  isNDARefused: boolean
  cefrLevel: null
  photoInfo: string
  skillsProfile: SkillsProfile
  firstName: string
  lastName: string
  dateOfBirth: string
  testValidUntil: string
  gseScore: string
  communicativeSkills: CommunicativeSkills
}

export interface SkillsProfile {
  openResponseSpeakingWriting: number
  reproducingSpokenWrittenLanguage: number
  writingExtended: number
  writingShort: number
  speakingExtended: number
  speakingShort: number
  multipleSkillsComprehension: number
  singleSkillComprehension: number
}

export interface CommunicativeSkills {
  listening: number
  speaking: number
  reading: number
  writing: number
}
