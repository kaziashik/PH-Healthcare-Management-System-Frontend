# Rendering methods: SSG, SSR, ISR, and CSR

Site: https://ph-healthcare-six.vercel.app
API: https://ph-healthcare-api.vercel.app

This frontend uses the Next.js App Router. The words SSG, SSR, and ISR are not written in the code. Next.js decides from the page file.

| Method | How you declare it | Used in this project |
| --- | --- | --- |
| SSG | Default, or `export const dynamic = "force-static"` | Yes. Journal, about, help, privacy, terms |
| SSR | `export const dynamic = "force-dynamic"`, or a `[param]` page with no `generateStaticParams` | Yes, only `/doctors/[doctorId]` |
| ISR | `export const revalidate = 60` | No |
| CSR | First line of the file is `"use client"`, then a hook loads the API in the browser | Yes. Home, directory, login, dashboards |

The production build prints `○` for a static route and `ƒ` for a route rendered on request.

## SSG

A Server Component page with the text written in the file is static. You do not have to add a special export.

`/journal` is the example. There is no `"use client"` and no API call.

```tsx
const posts = [
  {
    title: "How a same-day visit is booked",
    text: "Doctors publish one calendar date, between 3 and 8 hours.",
  },
];

export default function JournalPage() {
  return <h1>Journal</h1>;
}
```

File: `src/app/(public)/(marketing)/journal/page.tsx`

To force a page to stay static:

```tsx
export const dynamic = "force-static";
```

These routes are SSG:

- `/journal`
- `/about-us`
- `/help`
- `/privacy`
- `/terms`

## SSR

Declare a page as server-rendered on every request with:

```tsx
export const dynamic = "force-dynamic";

export default function Page() {
  return <h1>Rendered on every request</h1>;
}
```

This project does not use that line. `/doctors/[doctorId]` is still SSR because the folder name is dynamic and the page reads the id from the URL. There is no `generateStaticParams`, so Next.js cannot build one HTML file per doctor at deploy time. The build marks this route `ƒ`.

```tsx
export default async function DoctorDetailsPage({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const { doctorId } = await params;
  return <DoctorDetails doctorId={doctorId} />;
}
```

File: `src/app/(public)/(marketing)/doctors/[doctorId]/page.tsx`

Example route: `/doctors/046796e4-6749-4fbd-80fc-46f3a6cf596e`

Calling `cookies()` or `headers()` inside a page also turns that route into SSR.

The doctor profile data is still loaded in the browser. `doctor-details.tsx` starts with `"use client"` and calls `useGetDoctor(doctorId)`.

## ISR

Declare a number of seconds. The page stays static, then Next.js rebuilds it after that time:

```tsx
export const revalidate = 60;

export default function DoctorsPage() {
  return <h1>Doctors</h1>;
}
```

`60` means rebuild at most once a minute. No page in this project has `revalidate`, so ISR is off. New doctors and appointments show up because the browser calls the API.

## CSR

CSR is declared by the first line of a component:

```tsx
"use client";

import { useGetAllDoctors } from "@/hooks/doctor.hook";
```

The route file can stay a Server Component. It only renders the client component:

```tsx
import HomePage from "@/components/modules/marketing/home-page";

export default function Page() {
  return <HomePage />;
}
```

`useGetAllDoctors` runs after the page opens and calls the Express API. A new doctor appears without rebuilding the site.

Routes that use this split (static shell, data in the browser):

- `/`
- `/doctors`
- `/contact`
- `/login`, `/register`, `/apply`, `/forgot-password`, `/reset-password`
- `/patient`, `/patient/book`, `/patient/appointments`, `/patient/payments`, `/patient/profile`
- `/doctor`, `/doctor/schedules`, `/doctor/appointments`, `/doctor/profile`
- `/admin`, `/admin/analytics`, `/admin/approve-doctor`, `/admin/patients`, `/admin/admins`
- `/change-password`
