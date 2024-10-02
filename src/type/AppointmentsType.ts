export type AppointmentsType = Appointment[]

export interface Appointment {
  id: string
  userId: string
  examId: string
  examName: 'PTE Core'
  eventNotificationId: number
  subordinateEventNotificationId: number
  registrationId: string
  customerId: unknown
  cartId: unknown
  pairingTime: unknown
  creationTime: string
  paymentPending: boolean
  cancellationPendingSince: unknown
  confirmationNumber: string
  testCenter: TestCenter
  startDate: string
  duration: number
  displayTimeZone: string
  displayBookingDate: string
  displayBookingTime: string
  status: string
  dateScored: string
  score: string
  canShareScore: boolean
  accommodationStatus: number
  upcomingNotificationSent: boolean
  agencyBlocked: boolean
  lastModified: string
  canReschedule: string
  rescheduleTimes: number
}

export interface TestCenter {
  testCenterId: string
  name: string
  address: Address
}

export interface Address {
  apartment: unknown
  streetAddress: string
  streetAddress2: string
  streetAddress3: unknown
  city: string
  state: string
  country: string
  postalCode: string
}
