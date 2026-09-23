# Order Tracking Screen

A mobile Order Tracking screen for an e-commerce app. It replaces bare status labels ("Processing / Shipped / …") with a plain-language headline, a clear delivery timeline, the estimated delivery time and obvious next steps.

**Live demo:** https://task-1-order-tracking.vercel.app · Open the home page and pick a scenario. Each one is a direct link:

| Scenario | URL |
|---|---|
| On its way (on schedule) | `/orders/VS-1001` |
| **Delayed order**: original vs new ETA, reason, notify me / contact us / cancel & refund | `/orders/VS-1002` |
| **Delivered but not received**: proof-of-delivery photo, "Didn't get it?" checklist, report to support | `/orders/VS-1003` |
| **Tracking not available yet**: "We're preparing your order" plus when tracking is expected | `/orders/VS-1004` |
| Error state (API fails, with retry) | `/orders/VS-ERROR` |
| Empty state (unknown order number) | `/orders/VS-0000` |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · lucide-react · TanStack Query v5 · sonner (toasts)

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Structure

```
src/
  app/                               routes only (thin)
    page.tsx                         demo scenario picker
    orders/[orderId]/page.tsx        tracking page (Server Component)
    orders/[orderId]/loading.tsx     route-level skeleton
    orders/[orderId]/error.tsx       error boundary with retry
    not-found.tsx
    providers.tsx                    QueryClient + Toaster
  features/order-tracking/
    lib/derive-status.ts             order -> view model (scenario, tone, copy, timeline)
    lib/format.ts                    date / money formatting
    hooks/use-order-tracking.ts      useQuery / useMutation wrappers
    components/                      StatusHero, TrackingTimeline, DelayBanner, DeliveredCard,
                                     TrackingPendingCard, ReportIssueSheet, OrderSummary,
                                     OrderDetailsSheet, SupportActions, CancelOrderSheet ...
    types.ts
  services/order-service.ts          fake API with latency (the only file to swap for a real API)
  mocks/orders.ts                    typed fixtures, one per scenario
  components/ui/                     shadcn/ui (generated)
```

## Design decisions

- **One pure function decides what the user sees.** `deriveOrderView(order, now)` works out the scenario (`on-track | delayed | delivered | tracking-pending`), the tone, the headline and message, the ETA text and the timeline steps. Components only render that view model and never repeat business rules. The rules are:
  - delivered → `delivered`
  - no carrier yet → `tracking-pending`
  - a recorded delay **or** the ETA window has passed → `delayed`
  - otherwise → `on-track`
- **Tell people what it means, not just the status.** Every state leads with a sentence ("Your order is running late") and then says what happens next. The delayed state shows the original ETA crossed out next to the new one, plus the reason.
- **Real loading and error states.** The mock service waits ~900 ms and the `VS-ERROR` order throws, so the skeleton, error + retry and empty states come from TanStack Query rather than being faked in the UI. Query retries are off because the mock fails every time.
- **Scenario chosen by URL.** Every state has a direct link, which makes it easy to review, test and share.
- **Relative mock dates.** Fixtures are built relative to the current hour, so "late" is always late and "delivered 3 hours ago" is always recent, whenever the demo is opened.
- **Mobile first, 360–430px.** On phones the app is full width. On larger screens it sits in a centred 430px frame. Bottom sheets are used for details, reporting and cancelling, because they are the natural mobile pattern.
- **Small client boundary.** Route files (page, layout, loading, not-found) are Server Components. `"use client"` is only on the data-fetching screen, the providers and the interactive leaves (sheets, delay banner). Because the data is fetched on the client, the feature components below the screen do render on the client. See the trade-off below.

## Accessibility

- Semantic landmarks (`header`, `main`, `section` with `aria-labelledby`) and one `h1` per page.
- The timeline is an ordered list, with `aria-current="step"` on the active step and screen-reader text for each step's state.
- Status is never shown by colour alone: every tone has an icon and text, and the delay uses strike-through as well as colour.
- Visible focus rings (shadcn defaults). The loading skeleton is announced through `role="status"`, and the report form shows errors with `role="alert"`.
- The "Notify me" toggle uses `aria-pressed`. Decorative icons are `aria-hidden`.

## Trade-offs and what I'd do next

- Data is fetched on the client so the loading and error states are real. With a real API I'd prefetch on the server and hydrate the query, so the first paint already has data.
- Report, cancel and notify are mocked. With a backend they would be mutations that invalidate the order query.
- No automated tests yet, because of the time limit. First I'd add unit tests for `deriveOrderView` (it is pure, so this is cheap) and then a Playwright pass over the six scenario URLs.
- Locale and currency are hard-coded to `en-US` / `USD` for the demo.
