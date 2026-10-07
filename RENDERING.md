# How this project declares SSG, SSR, and ISR

Site: https://ph-healthcare-six.vercel.app
API: https://ph-healthcare-api.vercel.app



## Frontend folder

`node_modules`, `.next`, and `.vercel` are omitted. Those folders are installed or generated, not source.

```text
PH Healthcare Management System Frontend
├── public
│   ├── clinic
│   │   ├── clinic-consult.jpg
│   │   ├── clinic-corridor.jpg
│   │   ├── clinic-reception.jpg
│   │   ├── clinic-waiting.jpg
│   │   └── hero-hospital.jpg
│   ├── doctors
│   │   ├── arif.jpg
│   │   ├── farhana.jpg
│   │   ├── lamia.jpg
│   │   ├── mehzabin.jpg
│   │   ├── nabila.jpg
│   │   ├── nusrat.jpg
│   │   ├── rafiqul.jpg
│   │   ├── rukaiya.jpg
│   │   ├── sadia.jpg
│   │   └── tanvir.jpg
│   ├── doctor.type.ts
│   ├── file copy.svg
│   ├── file.svg
│   ├── globe copy.svg
│   ├── globe.svg
│   ├── login.jpg
│   ├── logo.svg
│   ├── next.svg
│   ├── register.jpg
│   ├── vercel copy.svg
│   ├── vercel.svg
│   ├── window copy.svg
│   └── window.svg
├── src
│   ├── api
│   │   ├── appointment.api.ts
│   │   ├── auth.api.ts
│   │   ├── contact.api.ts
│   │   ├── doctor.api.ts
│   │   ├── index.ts
│   │   ├── schedule.api.ts
│   │   └── user.api.ts
│   ├── app
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── (dashboard)
│   │   │   ├── layout.tsx
│   │   │   ├── admin
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── admins/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── approve-doctor/page.tsx
│   │   │   │   └── patients/page.tsx
│   │   │   ├── change-password/page.tsx
│   │   │   ├── doctor
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── appointments/page.tsx
│   │   │   │   ├── profile/page.tsx
│   │   │   │   └── schedules/page.tsx
│   │   │   ├── patient
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── appointments/page.tsx
│   │   │   │   ├── book/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   └── super_admin
│   │   └── (public)
│   │       ├── (authentication)
│   │       │   ├── apply/page.tsx
│   │       │   ├── forgot-password/page.tsx
│   │       │   ├── login/page.tsx
│   │       │   ├── register/page.tsx
│   │       │   ├── register/verify-account/page.tsx
│   │       │   └── reset-password/page.tsx
│   │       └── (marketing)
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           ├── about-us/page.tsx
│   │           ├── contact/page.tsx
│   │           ├── doctors/page.tsx
│   │           ├── doctors/[doctorId]/page.tsx
│   │           ├── help/page.tsx
│   │           ├── journal/page.tsx
│   │           ├── privacy/page.tsx
│   │           └── terms/page.tsx
│   ├── assets
│   │   └── svg
│   │       └── Logo.tsx
│   ├── components
│   │   ├── auth
│   │   │   ├── access-denied.tsx
│   │   │   ├── auth-auard.tsx
│   │   │   ├── auth-loading.tsx
│   │   │   └── role-guard.tsx
│   │   ├── dashboard
│   │   │   ├── account-menu.tsx
│   │   │   ├── count-chart.tsx
│   │   │   ├── dashboard-sidebar.tsx
│   │   │   └── dashboard.shell.tsx
│   │   ├── form
│   │   │   ├── change-password-form.tsx
│   │   │   ├── contact-form.tsx
│   │   │   ├── create-managed-account-form.tsx
│   │   │   ├── doctor-apply-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── password-input.tsx
│   │   │   ├── prescription-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   ├── schedule-form.tsx
│   │   │   ├── set-password-form.tsx
│   │   │   └── verify-account-form.tsx
│   │   ├── layout
│   │   │   └── public
│   │   │       ├── Footer.tsx
│   │   │       └── Header.tsx
│   │   ├── modules
│   │   │   ├── list-pager.tsx
│   │   │   ├── account-status/account-status-button.tsx
│   │   │   ├── admin-overview/admin-overview.tsx
│   │   │   ├── admins/admins-panel.tsx
│   │   │   ├── change-password/change-password-panel.tsx
│   │   │   ├── doctor-appointments/appointments-panel.tsx
│   │   │   ├── doctor-approval
│   │   │   │   ├── doctor-approval-table-loading.tsx
│   │   │   │   ├── doctor-approval-table.tsx
│   │   │   │   ├── doctor-approval-tabs.tsx
│   │   │   │   └── doctor-review-sheet.tsx
│   │   │   ├── doctor-overview/doctor-overview.tsx
│   │   │   ├── doctor-profile/doctor-profile.tsx
│   │   │   ├── doctor-schedules/schedules-panel.tsx
│   │   │   ├── doctors
│   │   │   │   ├── doctor-card.tsx
│   │   │   │   ├── doctor-details.tsx
│   │   │   │   └── doctors-explorer.tsx
│   │   │   ├── facebook-login/FacebookLogin.tsx
│   │   │   ├── google-login/GoogleLogin.tsx
│   │   │   ├── marketing/home-page.tsx
│   │   │   ├── patient-appointments/appointments-panel.tsx
│   │   │   ├── patient-book/book-panel.tsx
│   │   │   ├── patient-overview/patient-overview.tsx
│   │   │   ├── patient-payments/payments-panel.tsx
│   │   │   ├── patient-profile/patient-profile.tsx
│   │   │   └── patients/patients-panel.tsx
│   │   ├── theme
│   │   │   └── theme-toggle.tsx
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── field.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── pagination.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── spinner.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       └── tooltip.tsx
│   ├── hooks
│   │   ├── appointment.hook.ts
│   │   ├── auth.hook.ts
│   │   ├── contact.hook.ts
│   │   ├── doctor.hook.ts
│   │   ├── schedule.hook.ts
│   │   ├── use-mobile.ts
│   │   └── user.hook.ts
│   ├── lib
│   │   ├── apiClient.ts
│   │   ├── auth-redirect.ts
│   │   ├── demo-accounts.ts
│   │   ├── utils.ts
│   │   └── visit-time.ts
│   ├── providers
│   │   ├── google-auth.provider.tsx
│   │   ├── index.tsx
│   │   └── query.provider.tsx
│   ├── routes
│   │   ├── admin.routes.ts
│   │   ├── doctor.routes.ts
│   │   ├── index.ts
│   │   └── patient.routes.ts
│   ├── types
│   │   ├── api.type.ts
│   │   ├── appointment.type.ts
│   │   ├── auth.type.ts
│   │   ├── contact.type.ts
│   │   ├── doctor.type.ts
│   │   ├── index.ts
│   │   ├── schedule.type.ts
│   │   ├── sidbar.type.ts
│   │   └── user.type.ts
│   ├── utils
│   │   ├── api-error.util.ts
│   │   ├── file-size.util.ts
│   │   └── index.ts
│   └── validation
│       ├── auth.validation.ts
│       ├── contact.validation.ts
│       ├── doctor-application.validation.ts
│       ├── index.ts
│       ├── prescription.validation.ts
│       ├── schedule.validation.ts
│       └── user.validation.ts
├── .env
├── .env.local
├── .gitignore
├── AGENTS.md
├── biome.json
├── bun.lock
├── CLAUDE.md
├── components.json
├── FRONTEND_BUILD_PLAN.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── RENDERING.md
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── WORKFLOW.md
```
