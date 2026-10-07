# Frontend build plan

Stay inside the folders you already use. Every new feature is the same six steps, then a page and a sidebar link:

1. Type in `src/types`
2. Zod schema in `src/validation`
3. `apiClient` call in `src/api`
4. React Query hook in `src/hooks`
5. Form in `src/components/form`, or a table and sheet in `src/components/modules`
6. Page under `src/app/(dashboard)/<role>/.../page.tsx`, and a link in `src/routes/<role>.routes.ts`

Admin and super admin keep sharing `/admin`. Show "create super admin" and "block an admin" only when `user.role` is `SUPER_ADMIN`.

Build in this order. Accounts unblock the dashboards, admin screens match the management rules, then doctor schedules have to exist before a patient can book.

## Close the gaps in what you already built

Do this before new screens. The pieces are already there, and the API will reject the current forms.

- After login, send the user to their dashboard: patient to `/patient`, doctor to `/doctor`, admin and super admin to `/admin`. Login currently always goes to `/`.
- If `needPasswordChange` is true, send them to change-password first. The API blocks every other call until that password is changed.
- Add a password field to the doctor apply form and send it in `data.user.password`. The apply API requires it, and the current payload type does not include it.
- Remove the hardcoded super-admin email and password from the login form.

## Phase 1 — accounts

Public pages next to the login and register pages you already have:

- `/forgot-password` calls `POST /api/v1/auth/forgot-password`
- `/reset-password` calls `POST /api/v1/auth/reset-password`
- A logged-in change-password page calls `POST /api/v1/auth/change-password`
- On the patient profile, if the account has no password, show set-password and call `POST /api/v1/auth/set-password`

## Phase 2 — admin people screens

Keep doctor approval where it is (`/admin/approve-doctor`) and add block and unblock on that same table. Then add two pages:

- `/admin/patients` lists patients and blocks or unblocks them
- `/admin/admins` creates an admin. A super admin can also create a super admin and block or unblock an admin

Wire those to:

- `GET /api/v1/user/patients`
- `GET /api/v1/user/admins`
- `POST /api/v1/user/create-admin`
- `POST /api/v1/user/create-super-admin`
- `PATCH /api/v1/user/account-status`

Put the real links in `src/routes/admin.routes.ts` and drop the placeholder "Routing" and "Data Fetching" items.

## Phase 3 — doctor

`src/app/(dashboard)/doctor/layout.tsx` exists. Add the pages:

- `/doctor` overview
- `/doctor/schedules` — create, list, publish, and edit. The date locks after publish. The time range locks after the first booking. The meeting link stays editable. The form must enforce 3 to 8 hours on one calendar date.
- `/doctor/appointments` — move a visit from booked to ongoing, then to completed. From a completed visit, open a sheet to write findings and medicines and call `POST /api/v1/prescription/create-prescription`

## Phase 4 — patient

`src/app/(dashboard)/patient/layout.tsx` exists. Add the pages:

- `/patient` overview
- `/patient/book` — load `GET /api/v1/schedule/todays-schedule`, pick a schedule, and call `POST /api/v1/appointment/book-appointment`. Send the browser to the bKash URL the API returns.
- `/patient/appointments` — list visits, cancel with the one-hour refund rule explained on the button, and open the prescription when one exists
- `/patient/payments` — `GET /api/v1/payment/my-payments`
