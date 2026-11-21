# Loading: skeletons that hand over smoothly

Goal: when data is slow, the page shows its own outline (a skeleton in exactly the same shape), and the real content fades into that outline. Nothing jumps, nothing flashes. Preview: `/dev` → Loading.

## First: avoid the wait

A skeleton is the fallback, not the plan.

- Pages without per-request data are prerendered (static mode, or Cache Components in server mode): they appear instantly with **no** skeleton.
- Links prefetch: by the time you click, the next page is often ready.
- Only the part that waits gets a skeleton: the vet list, not the page heading or the filter bar.

## The three pieces

| Piece                               | Where                                                          | What it does                                                                                                                     |
| ----------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `<Skeleton>`                        | `components/ui/skeleton.tsx`                                   | Grey block that stays invisible for 150 ms (`--skeleton-delay`), then fades in and shimmers. Fast loads never flash.             |
| `<SuspenseReveal fallback={…}>`     | `components/motion/suspense-reveal.tsx`                        | `<Suspense>` + `<ViewTransition>`: the skeleton fades out (`exit-fade`), the content fades in and rises (`enter-rise`) in place. |
| `loading.tsx` + `PageShellSkeleton` | `app/[locale]/loading.tsx`, `components/layout/page-shell.tsx` | Whole-route fallback in the shape of `PageShell`; fades out as the page fades in.                                                |

## Same shape, exactly

1. **Twin components.** Every component that loads data has its skeleton in the same file: `VetCard` + `VetCardSkeleton`, `VetList` + `VetListSkeleton`. Change one, change both.
2. **Same boxes.** Reuse the real component's container (`Card`, the same grid, the same padding). Only the text and images become skeletons.
3. **Text lines: `h-[1lh]` + the same text classes.** `<Skeleton className="h-[1lh] w-2/3 text-base leading-snug" />` is exactly one line of that text, in every language (Bangla's taller line height included). Vary the widths (`w-2/3`, `w-1/2`) so it reads like text.
4. **Images: fixed aspect ratio** on both (`aspect-square`, `aspect-video`, `size-12 rounded-full` for avatars).
5. **Lists: the number you expect** (a page of results = 6 cards), not one.
6. **Lengths that vary** (a review, a bio): give the real block a `min-h-*` that matches the skeleton.
7. No spinners for content. Spinners only inside a button that is saving (`toast.promise`, `useActionState` pending).

## Accessibility

- The skeleton container has `role="status"` and `aria-label={t("loading.label")}` (PageShellSkeleton does it); the blocks themselves are `aria-hidden`.
- Reduced motion: no shimmer, no fade; the content simply replaces the skeleton.

## Example

```tsx
// features/vets/components/vet-list.tsx
export async function VetList({ area }: { area: string }) {
  const vets = await getVets(area);
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {vets.map((v) => (
        <VetCard key={v.id} vet={v} />
      ))}
    </ul>
  );
}

export function VetListSkeleton() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i}>
          <VetCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

// app/[locale]/vets/page.tsx
<PageShell title={t("vets.title")}>
  <Filters />
  <SuspenseReveal fallback={<VetListSkeleton />}>
    <VetList area={area} />
  </SuspenseReveal>
</PageShell>;
```

## Check

- Throttle to "Slow 4G" in DevTools: the skeleton appears, then the content lands in the same place.
- Lighthouse: CLS 0.
- Reduced motion on: no animation, still no jump.
