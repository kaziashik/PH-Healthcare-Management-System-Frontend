# PH Healthcare API endpoints

Base URL: `https://ph-healthcare-api.vercel.app`

Every route below is prefixed with `/api/v1`, except `GET /` and `GET /test`, which sit on the server root.

Signed-in routes read the httpOnly auth cookie. Send requests with credentials included.

A password, where a route asks for one, must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.

List routes share these query fields unless a row says otherwise:

| Query | Default |
| --- | --- |
| `page` | `1` |
| `limit` | `10` |
| `sortBy` | `createdAt` |
| `sortOrder` | `desc` (`asc` or `desc`) |

## Root

| Method | Path | Who | What it does |
| --- | --- | --- | --- |
| GET | `/` | Public | Welcome message. |
| GET | `/test` | Public | Welcome message plus a random 6-digit number. |

## Auth — `/api/v1/auth`

| Method | Path | Who | Body | What it does |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Public | `name` (3–10 characters), `email`, `password`. Optional `patient`: `contactNumber`, `gender` (`MALE`, `FEMALE`, `OTHER`), `dateOfBirth`, `bloodGroup`, `medicalHistory` | Starts a patient account and sends an email code. |
| POST | `/auth/verify-email` | Public | `email`, `otp` (6 characters) | Confirms the patient email. |
| POST | `/auth/login` | Public | `email`, `password` | Signs in and sets the auth cookie. |
| GET | `/auth/login` | Patient, Doctor, Admin, Super admin | — | Returns the signed-in user. Same handler as `/auth/me`. |
| GET | `/auth/me` | Patient, Doctor, Admin, Super admin | — | Returns the signed-in user. |
| POST | `/auth/google` | Public | `idToken` | Signs in with Google and creates a patient account when needed. |
| POST | `/auth/facebook` | Public | `accessToken` | Signs in with Facebook. The app stays off until Facebook credentials exist. |
| POST | `/auth/refresh-token` | Cookie | — | Issues a new access token from the refresh cookie. |
| POST | `/auth/forgot-password` | Public | `email` | Sends a reset code. |
| POST | `/auth/reset-password` | Public | `email`, `newPassword`, `otp` (6 characters) | Sets a new password with the email code. |
| POST | `/auth/change-password` | Patient, Doctor, Admin, Super admin | `currentPassword`, `newPassword` | Changes the password of the signed-in user. |
| POST | `/auth/set-password` | Patient | `newPassword` | Sets a password for a patient who signed in with Google. |
| POST | `/auth/logout` | Public | — | Clears the auth cookie. |

## Users — `/api/v1/user`

| Method | Path | Who | Body or query | What it does |
| --- | --- | --- | --- | --- |
| POST | `/user/create-admin` | Admin, Super admin | `name`, `organizationEmail`, `personalEmail`. Optional `contactNumber`, `address` | Creates an admin account. |
| POST | `/user/create-super-admin` | Super admin | Same fields as create admin | Creates a super admin account. |
| PATCH | `/user/account-status` | Admin, Super admin | `userId`, `status` (`ACTIVE` or `BLOCKED`) | Blocks or unblocks an account. |
| GET | `/user/patients` | Admin, Super admin | `page`, `limit`, `sortBy`, `sortOrder`, `status`, `searchTerm` | Lists patients. |
| GET | `/user/admins` | Admin, Super admin | Same query as patients | Lists admins. |
| PATCH | `/user/profile-image` | Patient, Doctor, Admin, Super admin | Multipart field `profileImage` | Uploads a profile photo. |

## Doctors — `/api/v1/doctor`

| Method | Path | Who | Body or query | What it does |
| --- | --- | --- | --- | --- |
| POST | `/doctor/apply-as-doctor` | Public | Multipart. JSON fields `user` (`name`, `email`, `password`) and `doctor` (`specialization`, `licenseNumber`, `qualifications`, `experienceYears`. Optional `address`, `bio`, `consultationFee`, `contactNumber`). Files: `resume` (1), `additionalFiles` (up to 10) | Submits a doctor application and sends an email code. |
| POST | `/doctor/apply-as-doctor/verify-email` | Public | `email`, `otp` (6 characters) | Confirms the doctor email. The account stays off the public list until an admin approves it. |
| POST | `/doctor/approve-doctor` | Admin, Super admin | `doctorId`, `verificationStatus` (`APPROVED` or `REJECTED`). Optional `rejectionReason` | Approves or rejects an application. |
| GET | `/doctor/all-doctors` | Public. Admin and Super admin see more when signed in | `page`, `limit`, `searchTerm`, `specialization`, `maxFee`, `minExperience`, `email`, `licenseNumber`, `sortBy` (`createdAt`, `name`, `consultationFee`, `experienceYears`), `sortOrder`. Managers may also send `verificationStatus` | Lists doctors. Guests and patients only receive approved, active, email-verified doctors. |
| GET | `/doctor/:doctorId` | Public, with the same visibility rule | — | One doctor. |
| PATCH | `/doctor/update-my-profile` | Doctor | Optional `address`, `bio`, `consultationFee`, `contactNumber` | Updates the signed-in doctor's profile. |

## Schedules — `/api/v1/schedule`

A schedule is 3 to 8 hours, stays on one calendar date, and splits into 20-minute slots. It starts as `DRAFT`. The date locks after publish. The time range locks after the first booking.

| Method | Path | Who | Body or query | What it does |
| --- | --- | --- | --- | --- |
| POST | `/schedule/create-schedule` | Doctor | `startDateTime`, `endDateTime`, `meetingLink` | Creates a draft schedule. |
| GET | `/schedule/my-schedules` | Doctor | `page`, `limit`, `sortBy`, `sortOrder`, `status` | Lists the signed-in doctor's schedules. |
| GET | `/schedule/all-schedules` | Admin, Super admin | `page`, `limit`, `sortBy`, `sortOrder`, `status`, `doctorId`, `email`, `searchTerm` | Lists schedules. |
| GET | `/schedule/todays-schedule` | Public | `page`, `limit`, `sortBy`, `sortOrder`. Optional `doctorId` | Published schedules for today that still have an open slot and have not started. |
| PATCH | `/schedule/update-schedule/:scheduleId` | Doctor | Optional `startDateTime`, `endDateTime`, `meetingLink`, `status` (`DRAFT` or `PUBLISHED`) | Updates a schedule the doctor owns. |
| PATCH | `/schedule/publish-schedule/:scheduleId` | Doctor | — | Publishes a draft. The date locks after this. |
| GET | `/schedule/:scheduleId` | Doctor, Admin, Super admin | — | One schedule. |
| DELETE | `/schedule/:scheduleId` | Doctor | — | Deletes a schedule the doctor owns. |

## Appointments — `/api/v1/appointment`

A booking is same-day and only before the schedule starts. It begins as `PENDING` and becomes `BOOKED` after bKash succeeds. Cancel more than 1 hour before the start for a refund.

| Method | Path | Who | Body or query | What it does |
| --- | --- | --- | --- | --- |
| POST | `/appointment/book-appointment` | Patient | `scheduleId` | Creates a pending appointment. |
| POST | `/appointment/pay-appointment` | Patient | `appointmentId` | Opens the bKash payment page. |
| GET | `/appointment/book-appointment/payment/callback` | bKash redirect | Payment query from bKash | Confirms payment and assigns the serial. |
| POST | `/appointment/cancel-appointment` | Patient, Admin, Super admin | `appointmentId` | Cancels the visit. A patient refund follows the 1-hour rule. |
| PATCH | `/appointment/update-status/:appointmentId` | Doctor | `status` (`ONGOING` or `COMPLETED`) | Moves a booked visit forward. |
| GET | `/appointment/my-appointments` | Patient | `page`, `limit`, `sortBy`, `sortOrder`, `status` | The signed-in patient's visits. |
| GET | `/appointment/doctor-appointments` | Doctor | Same query as my appointments | The signed-in doctor's visits. |
| GET | `/appointment/all-appointments` | Admin, Super admin | `page`, `limit`, `sortBy`, `sortOrder`, `status`, `doctorId`, `patientId`, `doctorEmail`, `patientEmail` | Every visit. |
| GET | `/appointment/:appointmentId` | Patient, Doctor, Admin, Super admin | — | One visit. |

## Prescriptions — `/api/v1/prescription`

| Method | Path | Who | Body | What it does |
| --- | --- | --- | --- | --- |
| POST | `/prescription/create-prescription` | Doctor | `appointmentId`, `findings` (at least 5 characters), `medicines` (at least one). Each medicine: `name`, `dosage`, `duration`. Optional `instructions` | Writes a prescription after the visit is completed. |
| GET | `/prescription/:appointmentId` | Patient, Doctor, Admin, Super admin | — | The prescription for that visit. |

## Payments — `/api/v1/payment`

| Method | Path | Who | Query | What it does |
| --- | --- | --- | --- | --- |
| GET | `/payment/my-payments` | Patient | `page`, `limit`, `sortBy`, `sortOrder` | The signed-in patient's payments. |
| GET | `/payment/all-payments` | Admin, Super admin | `page`, `limit`, `sortBy`, `sortOrder`, `patientEmail` | Every payment. |
| GET | `/payment/:paymentId` | Patient, Admin, Super admin | — | One payment. |

## Contact — `/api/v1/contact`

| Method | Path | Who | Body | What it does |
| --- | --- | --- | --- | --- |
| POST | `/contact` | Public | `name` (at least 2 characters), `email`, `subject` (at least 5), `message` (at least 20) | Sends a message to the clinic inbox. This is not a booking. |
