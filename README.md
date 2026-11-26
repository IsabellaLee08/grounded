# Grounded

A phone app (iOS, React Native + Expo + TypeScript) that puts every UVA club event and
Charlottesville student pop-up in one calendar, with a personalized "For You" feed.
Styled after the Grounded pitch deck.

## Run it
1. Install Node 18+ and VS Code (the Prettier + Expo Tools extensions are suggested).
2. `cd grounded && npm install`
3. `npx expo install --fix`   (aligns native package versions with your Expo version)
4. `npx expo start`, then scan the QR code with the camera on your iPhone (install **Expo Go** first).
   On a Mac with Xcode, press `i` for the iOS Simulator.
5. `npm run typecheck` to check types.

## Where things live
| What | File |
|---|---|
| Colors / fonts (deck look) | `src/theme.ts` |
| Tables (Users, Events, Organizations, ...) | `src/types.ts` |
| Sample clubs, businesses, events | `src/data.ts` |
| "AI" recommendations | `src/recommend.ts` |
| App state + local persistence | `src/store.tsx` |
| Screens | `src/screens/*` |

## Feature map (from the build plan)
- **Events** gallery (cards, category filters, Follow) and **Calendar** (month grid, day list)
- **Discover**: Clubs & Organizations and Local Businesses, search, follow
- **For You**: onboarding survey -> recommendations with reason chips
- **You**: Events you follow, submit an event, admin Review Queue (approve -> publishes)

## Next steps
- Data is stored on-device (AsyncStorage). Swap `src/store.tsx` for a real backend
  (Supabase / Firebase) so submissions and approvals are shared between users.
- `recommend()` is rule-based. To use an LLM, call your backend from there and return
  `{ kind, id, score, reasons[] }[]`. Never put an API key in the app.
- Subscriptions (businesses ~$10/mo, premium ~$0.99/mo) are not implemented; use RevenueCat/StoreKit.
- Event images are gradients for now; add `expo-image-picker` for photos.
