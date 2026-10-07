# PH Healthcare workflow

Site: https://ph-healthcare-six.vercel.app
API: https://ph-healthcare-api.vercel.app

This file describes how the live app behaves. The diagrams match the current Express API and Next.js pages.

Roles are `PATIENT`, `DOCTOR`, `ADMIN`, and `SUPER_ADMIN`. Admin and super admin share the `/admin` area. A super admin is the only role that can create another admin or block an admin.

Open this file in a Markdown viewer that renders Mermaid (GitHub, VS Code, or Cursor) to see the charts.

## Map of the product

```mermaid
flowchart LR
  visitor[Visitor] --> home[Public site]
  home --> register[Patient register]
  home --> apply[Doctor apply]
  home --> login[Sign in]
  register --> patient[Patient dashboard]
  apply --> review[Admin review]
  review --> doctor[Doctor dashboard]
  login --> patient
  login --> doctor
  login --> admin[Admin dashboard]
  patient --> book[Book and pay]
  doctor --> schedule[Publish a schedule]
  schedule --> book
  book --> visit[Visit and prescription]
```

## 1. Visitor flow

Anyone can read the public pages without an account: home, doctor directory, doctor details, about, journal, help, contact, privacy, and terms.

The directory lists only doctors who are approved, active, email-verified, and not deleted. Contact messages are not bookings.

```mermaid
flowchart TD
  start[Open the site] --> browse[Browse doctors and clinic pages]
  browse --> choice{What do they want?}
  choice -->|Book a visit| patientAccount[Create a patient account]
  choice -->|Work at the clinic| doctorApply[Apply as a doctor]
  choice -->|Already registered| signIn[Sign in]
  choice -->|Ask a question| contact[Send a contact message]
  patientAccount --> verifyEmail[Enter the email code]
  verifyEmail --> patientHome[Patient dashboard]
  doctorApply --> waitReview[Wait for email verification and admin approval]
  signIn --> roleHome[Role dashboard]
  contact --> done[Message stored for the clinic]
```

## 2. Patient flow

A patient is the person who books a visit.

Sign-up paths:

- Email and password, then an email verification code.
- Google sign-in, which creates a patient account. If that account has no password, the next stop is the patient profile so a password can be set.

After login:

1. If `needPasswordChange` is true, the app opens `/change-password`.
2. If the role is patient and the account has no password, the app opens `/patient/profile`.
3. Otherwise a patient opens `/patient`.

Booking rules:

- The schedule must be published.
- Booking is allowed only on the same calendar day, and only before the schedule starts.
- The patient pays the doctor's consultation fee with bKash.
- A successful payment marks the visit `BOOKED` and assigns the next 20-minute serial.
- One patient cannot hold two active visits on the same schedule.
- Cancel more than 1 hour before the start time to receive a bKash refund. Later than that, the visit is cancelled with no refund.

```mermaid
flowchart TD
  start[Patient starts] --> account{Has an account?}
  account -->|No| register[Register or continue with Google]
  register --> otp[Verify email when the account uses a password]
  account -->|Yes| login[Sign in]
  otp --> gate{Password gate}
  login --> gate
  gate -->|Must change password| changePw[Change password]
  gate -->|Google account with no password| profile[Set a password on the profile]
  gate -->|Ready| dash[Patient dashboard]
  changePw --> dash
  profile --> dash
  dash --> pick[Open a doctor and choose today's published schedule]
  pick --> pay[bKash checkout for the consultation fee]
  pay --> paid{Payment result}
  paid -->|Success| booked[Visit is booked with a 20-minute serial]
  paid -->|Failure or cancel| unpaid[Visit stays unpaid]
  booked --> attend[Join at the serial time]
  attend --> rx[Open the prescription after the doctor completes the visit]
  booked --> cancel{Cancel?}
  cancel -->|More than 1 hour before start| refund[bKash refund]
  cancel -->|Inside the last hour| noRefund[Cancelled without a refund]
```

### Patient booking sequence

```mermaid
sequenceDiagram
  actor Patient
  participant Site as Next.js site
  participant API as Express API
  participant bKash as bKash sandbox

  Patient->>Site: Choose a published schedule
  Site->>API: Book appointment
  API->>API: Create PENDING visit if slots remain
  API->>bKash: Create checkout for the consultation fee
  bKash-->>Patient: Wallet, OTP, and PIN page
  Patient->>bKash: Complete or cancel payment
  bKash->>API: Payment callback
  alt Payment succeeds
    API->>API: Mark PAID, status BOOKED, assign serial
    API-->>Site: Redirect to /patient/appointments?status=success
  else Payment fails or is cancelled
    API-->>Site: Redirect with failure or cancel
  end
  Patient->>Site: Open appointments
```

### Cancel and refund sequence

```mermaid
sequenceDiagram
  actor Patient
  participant API as Express API
  participant bKash as bKash

  Patient->>API: Cancel appointment
  API->>API: Compare now with 1 hour before the start
  alt More than 1 hour remains
    API->>bKash: Refund the paid amount
    bKash-->>API: Refund result
    API->>API: Status CANCELLED, payment REFUNDED, slot released
  else Inside the last hour
    API->>API: Status CANCELLED, no refund
  end
  API-->>Patient: Updated appointment
```

## 3. Doctor flow

A doctor cannot sign in until both of these are true:

- The email is verified.
- An admin has approved the application.

Until then the public directory does not show that doctor.

Schedule rules:

- The window is 3 to 8 hours on one calendar date.
- Each paid visit takes the next open 20-minute serial inside that window.
- A draft can be edited freely.
- After publish, the date is locked.
- After the first booked visit, the time range is locked.
- The schedule needs a meeting link before patients can join.

After a completed visit, the doctor records findings and medicines. The API builds a prescription PDF, stores it, and emails it to the patient.

```mermaid
flowchart TD
  start[Doctor starts] --> apply[Apply with profile, license, password, and resume]
  apply --> verify[Verify email with the code]
  verify --> pending[Application stays PENDING]
  pending --> review{Admin decision}
  review -->|Rejected with a reason| rejected[Email says the application was rejected]
  review -->|Approved| approved[Email says the application was approved]
  rejected --> stop[Cannot sign in]
  approved --> login[Sign in]
  login --> gate{Must change password?}
  gate -->|Yes| changePw[Change password]
  gate -->|No| dash[Doctor dashboard]
  changePw --> dash
  dash --> draft[Create a 3 to 8 hour schedule as DRAFT]
  draft --> publish[Publish the schedule]
  publish --> locked[Date is locked]
  locked --> visits[Patients book and pay]
  visits --> timeLock[Time range locks after the first booking]
  timeLock --> complete[Mark the visit completed]
  complete --> rx[Write findings and medicines]
  rx --> pdf[Patient receives the prescription]
```

### Doctor approval sequence

```mermaid
sequenceDiagram
  actor Doctor
  participant API as Express API
  actor Admin
  participant Mail as Email

  Doctor->>API: Apply as a doctor
  API->>Mail: Send verification code
  Doctor->>API: Submit the code
  API->>API: Email verified, status still PENDING
  Admin->>API: Open pending applications
  alt Approve
    Admin->>API: Set status APPROVED
    API->>Mail: Approval email
    Doctor->>API: Sign in
    API-->>Doctor: Doctor dashboard
  else Reject
    Admin->>API: Set status REJECTED with a reason
    API->>Mail: Rejection email
    Doctor->>API: Sign in
    API-->>Doctor: Refused until approved
  end
```

### Prescription sequence

```mermaid
sequenceDiagram
  actor Doctor
  participant API as Express API
  participant Store as File storage
  participant Mail as Email
  actor Patient

  Doctor->>API: Complete the visit
  Doctor->>API: Save findings, medicine, dosage, and duration
  API->>API: Build the prescription PDF
  API->>Store: Save the PDF
  API->>Mail: Email the PDF to the patient
  Patient->>API: Open the prescription from appointments
  API-->>Patient: Prescription file
```

## 4. Admin flow

`ADMIN` and `SUPER_ADMIN` both land on `/admin` after login, unless a password change is required.

Shared work:

- Read clinic counts and the analytics page.
- Search and approve or reject doctor applications. A doctor must verify email before review. Rejection requires a reason.
- View patients.

Super admin only:

- Create an admin.
- Block or unblock an admin or super admin.

A blocked user cannot sign in.

```mermaid
flowchart TD
  start[Admin signs in] --> gate{Must change password?}
  gate -->|Yes| changePw[Change password]
  gate -->|No| dash[Admin dashboard]
  changePw --> dash
  dash --> counts[Counts and analytics]
  dash --> doctors[Doctor applications]
  dash --> patients[Patient list]
  dash --> admins{Role}
  doctors --> emailOk{Email verified?}
  emailOk -->|No| wait[Review is blocked]
  emailOk -->|Yes| decision{Decision}
  decision -->|Approve| approved[Doctor can sign in and appear in the directory]
  decision -->|Reject| reason[Reason is required, doctor is emailed]
  admins -->|Admin| stop[Cannot create or block admins]
  admins -->|Super admin| manage[Create an admin or block and unblock an admin]
```

### Sign-in sequence for every role

```mermaid
sequenceDiagram
  actor Person
  participant Site as Next.js site
  participant API as Express API

  Person->>Site: Email and password, or Google
  Site->>API: Sign in
  alt Blocked, wrong password, or unverified email
    API-->>Site: Sign-in refused
  else Doctor is not approved
    API-->>Site: Sign-in refused
  else Success
    API-->>Site: Session cookie
    alt needPasswordChange
      Site-->>Person: /change-password
    else Patient with no password
      Site-->>Person: /patient/profile
    else Patient
      Site-->>Person: /patient
    else Doctor
      Site-->>Person: /doctor
    else Admin or super admin
      Site-->>Person: /admin
    end
  end
```

## Status words used in the API

| Record | Values | Meaning in the product |
| --- | --- | --- |
| Doctor verification | `PENDING`, `APPROVED`, `REJECTED` | Only `APPROVED` doctors can sign in and appear in the directory |
| Schedule | `DRAFT`, `PUBLISHED` | Patients can book only a published schedule |
| Appointment | `PENDING`, `BOOKED`, `CONFIRMED`, `ONGOING`, `COMPLETED`, `CANCELLED` | A new booking starts as `PENDING` and becomes `BOOKED` after payment |
| Payment | `UNPAID`, `PAID`, `FAILED`, `CANCELLED`, `REFUNDED` | The fee is collected and refunded through bKash |
| User | `ACTIVE`, `BLOCKED`, `DELETED` | A blocked user cannot sign in |

## Page each role opens

| Role | Home after sign-in | Main pages |
| --- | --- | --- |
| Patient | `/patient` | Book, appointments, payments, profile |
| Doctor | `/doctor` | Schedules, appointments, profile |
| Admin | `/admin` | Analytics, approve doctors, patients |
| Super admin | `/admin` | Same as admin, plus admins |
