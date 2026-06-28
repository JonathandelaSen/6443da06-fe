# Frontend Technical Assessment

## Bug fixes

### 1. Missing `key` prop in the issue list

Each child in a list needs a stable, unique `key`. The issues were rendered
without one, triggering the React console warning. Fixed by giving every issue
object an `id` and using it as the `key` on each `<ListItem>`.
(`src/pages/Home/index.tsx`)

### 2. The word "known" was not displayed in bold

The intro text carries `<b>` markup, but it was rendered with `t("home.intro")`,
which outputs a plain string, so the markup never became real DOM. Replaced it
with the `<Trans>` component mapping `b` → `<strong />`, **without changing the
i18n text**. (`src/pages/Home/index.tsx`)

### 3. User avatar missing in the app bar (two bugs)

- **Typo in the store:** `getOwnUser` assigned the result to `this.urser`
  instead of `this.user`, so the user was never actually stored and the avatar
  had no data. (`src/api/services/User/store.ts`)
- **Missing ref forwarding:** `AvatarMenu` is rendered inside a MUI `<Grow>`
  transition, which forwards a `ref` to its child. The component didn't accept
  one, so the transition failed. Wrapped it in `React.forwardRef` and applied
  the `ref` to its root element. (`src/components/AvatarMenu/index.tsx`)

### 4. Countdown breaking "sometimes"

The `setInterval` in the header was created inside a `useEffect` with **no
cleanup**. Whenever the effect re-ran (HMR during development, a remount, or
React 18 StrictMode's double-mount), a new interval was added while the old one
kept running, so the intervals stacked and the timer ran 2×, 3×… faster. On
unmount the orphaned timers also kept firing (memory/CPU leak). Because it only
surfaced via HMR, it looked random and impossible to reproduce reliably.

Fixes (`src/components/AppHeader/index.tsx`):

- Return `() => clearInterval(id)` from the effect → an idempotent
  subscription: always exactly one live interval, and it is cancelled on
  unmount.
- Stop ticking at zero: derive `finished = count >= seconds` and guard the
  effect (`if (finished) return;` with `[finished]` in the deps) so the interval
  is cleared once the countdown completes instead of running forever and
  re-rendering every second for nothing.
- Clamp the displayed value with `Math.max(seconds - count, 0)` so it never
  renders negative numbers.

### 5. Language switcher

Added a language select control to the app bar so the UI can be switched
between English and German.

- **Control (`src/components/AppHeader/index.tsx`):** a button with a translate
  icon showing the active language opens a MUI `<Menu>` listing _English_ and
  _Deutsch_, with a check mark next to the current one. Selecting an entry calls
  `i18n.changeLanguage`.
- **Preference resolution and persistence
  (`src/i18n/languagePreference.ts`):** the chosen locale is normalized to a
  supported language (`en`/`de`) and stored in `localStorage` under
  `osapiens.uiLanguage`, guarded so the app still switches when storage is
  unavailable. Helpers also read the stored preference and detect the browser
  language.
- **i18n wiring (`src/i18n/i18n.tsx`):** the initial language is resolved as
  stored preference → browser language → fallback (`en`). A `languageChanged`
  listener persists the new preference and updates `document.documentElement.lang`.
- **Translations (`src/i18n/locales/en.json`, `de.json`):** German strings were
  added for the home page and app chrome so the UI fully reflects the selected
  language.

## Notes

The Create React App ESLint configuration was added to `package.json` so
TypeScript files are parsed correctly. Without it, false parsing errors
triggered a full-screen error overlay that intercepted user interactions and
made controls appear unresponsive.
