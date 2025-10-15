# Nextjs Page Default Export

Before:
```ts
export function Home() {
    ...
```

Error:
```
Type error: Type 'typeof import("/Users/olivermolnar/Desktop/solace-market/src/pages/HomePage")' does not satisfy the constraint 'PagesPageConfig'.
  Property 'default' is missing in type 'typeof import("/Users/olivermolnar/Desktop/solace-market/src/pages/HomePage")' but required in type 'PagesPageConfig'.

Next.js build worker exited with code: 1 and signal: null
error: script "build" exited with code 1
```

After:
```ts
export default function Home() {
    ...
```