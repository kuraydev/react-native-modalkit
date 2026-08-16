# 🪟 react-native-modalkit

> The modern, [Reanimated](https://docs.swmansion.com/react-native-reanimated/)-first **drop-in replacement** for [`react-native-modal`](https://github.com/react-native-modal/react-native-modal) — same props you already know, all running on the UI thread.

[![npm version](https://img.shields.io/npm/v/react-native-modalkit?style=for-the-badge)](https://www.npmjs.com/package/react-native-modalkit)
[![npm downloads](https://img.shields.io/npm/dt/react-native-modalkit.svg?style=for-the-badge)](https://www.npmjs.com/package/react-native-modalkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue.svg?style=for-the-badge)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

<p align="center">
  <img src="./assets/demo.gif" alt="react-native-modalkit demo — sheets, dialogs, and fullscreen modals" width="320" />
</p>

<p align="center">
  <img src="./assets/ss1.png" alt="react-native-modalkit screenshot 1" width="280" />
  &nbsp;
  <img src="./assets/ss2.png" alt="react-native-modalkit screenshot 2" width="280" />
</p>

## 🌟 Highlights

- 🔁 **Drop-in API** — change one import line; `animationIn`, `swipeDirection`, `customBackdrop`, `onModalHide` and friends all keep working
- 🆕 Built for **React Native 0.78+** and the **New Architecture** (Fabric)
- ⚡ Animations driven by **Reanimated worklets** (3 and 4) — zero JS-thread jank
- 👆 Swipe-to-dismiss on **gesture-handler v2** — plays nicely with nested scrollables
- 🪝 **Imperative API** — `useModal()` ref-based control, no render-state wiring
- 🌍 **Global modals** — queue-aware `<ModalProvider>` + `ModalManager.show/hide`
- 💬 **Promise dialogs** — `await ModalManager.confirm({...})` / `.alert({...})`
- 📐 `position="bottom" | "top" | "center" | "fullscreen"` layout + animation shortcuts
- 🎬 Preset, keyframe, and full Reanimated spring/timing animation configs + `registerAnimation`
- ♿ Respects the OS **reduced-motion** setting out of the box
- ⏱️ **Reliable `onModalHide` timing** — fires only after the native dismiss completes, so chained modals never lock the screen

## 🤔 Why modalkit?

`react-native-modal` served the community for years, but it's **no longer actively maintained** and has **no New Architecture support**. It still leans on `react-native-animatable`, the legacy `Animated` API, and `PanResponder` — all showing their age on modern React Native. Apps on the New Arch (default since RN 0.76) hit edge cases upstream can't fix.

**modalkit** picks up where it left off: the same API surface, rebuilt on the modern stack.

## 📦 Install

```sh
npm install react-native-modalkit react-native-reanimated react-native-gesture-handler
# or
yarn add react-native-modalkit react-native-reanimated react-native-gesture-handler
```

Follow the standard setup for the two peers — [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) · [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation) — and wrap your app in `<GestureHandlerRootView>` (most templates already do).

| Peer                           | Required version |
| ------------------------------ | ---------------- |
| `react`                        | `>=18.3`         |
| `react-native`                 | `>=0.78`         |
| `react-native-reanimated`      | `>=3.10` (4.x supported) |
| `react-native-gesture-handler` | `>=2.16`         |

## 🚀 Quick start

```tsx
import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import Modal from "react-native-modalkit";

export const MyDialog = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View>
      <Button title="Open" onPress={() => setIsVisible(true)} />
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        onSwipeComplete={() => setIsVisible(false)}
        swipeDirection="down"
        position="bottom"
      >
        <View style={{ padding: 24, backgroundColor: "white", borderRadius: 12 }}>
          <Text>Hello modalkit 👋</Text>
        </View>
      </Modal>
    </View>
  );
};
```

## 🔁 Migrating from `react-native-modal`

For most projects, this is the entire diff:

```diff
- import Modal from "react-native-modal";
+ import Modal from "react-native-modalkit";
```

Every public prop carries the same name and shape. Two props that no longer make sense are accepted with a one-time dev warning:

| Prop                         | Status                                                 |
| ---------------------------- | ------------------------------------------------------ |
| `useNativeDriver`            | accepted, no-op (Reanimated already runs on UI thread) |
| `useNativeDriverForBackdrop` | accepted, no-op                                        |

<details>
<summary><b>Coming from react-native-global-modal-2 or react-native-modal-2?</b></summary>

modalkit supersedes both (now archived):

- [`react-native-global-modal-2`](https://github.com/kuraydev/react-native-global-modal-2) — replace `<GlobalModal>` with `<ModalProvider>`, and `ModalController.show/hide` with `ModalManager.show/hide`. Same imperative shape, plus everything on that library's roadmap — and no more `react-native-modal` peer dep.
- [`react-native-modal-2`](https://github.com/kuraydev/react-native-modal-2) — `<Modal visible>` becomes `<Modal isVisible>`, `<AnimatedModal>` collapses back into `<Modal>` (animated by default), and animation strings change from `animationType="fade"` / `animationIn="slide" + animationDirection="up"` to standard preset names (`fadeIn`, `slideInUp`, `bounceIn`, `zoomIn`). Backdrop props pass through unchanged.

</details>

## 🎬 Animations

`animationIn` / `animationOut` accept any of three shapes:

```tsx
// 1. Built-in preset name (same names as react-native-modal)
<Modal animationIn="slideInUp" animationOut="slideOutDown" />

// 2. Custom keyframe object (react-native-animatable shape)
<Modal animationIn={{ from: { opacity: 0, scale: 0.7 }, to: { opacity: 1, scale: 1 } }} />

// 3. Reanimated config — full control, springs supported.
//    Pair with `preset` so the physics drives a visible transform.
<Modal animationIn={{ type: "spring", preset: "zoomIn", damping: 11, stiffness: 110 }} />
<Modal animationIn={{ type: "timing", preset: "slideInUp", duration: 250 }} />
```

> Without `preset`, a Reanimated config drives the position default's frames (`fadeIn` for `position="center"`), which makes a spring's overshoot invisible — set `preset` if you want the boing.

**Built-in presets:** `slideInUp/Down/Left/Right`, `slideOutUp/Down/Left/Right`, `fadeIn`, `fadeOut`, `fadeInUp/Down/Left/Right`, `fadeOutUp/Down/Left/Right`, `zoomIn`, `zoomOut`, `bounceIn`, `bounceOut`, `flipInX/Y`, `flipOutX/Y`, `pulse`.

**Register your own** (the `react-native-animatable` equivalent):

```ts
import { registerAnimation } from "react-native-modalkit";

registerAnimation("myFancySlide", {
  from: { opacity: 0, translateY: 200 },
  to: { opacity: 1, translateY: 0 },
});
```

### 📐 Position shortcuts

```tsx
<Modal position="bottom">…</Modal>     // slideInUp / slideOutDown, edge-to-edge
<Modal position="top">…</Modal>        // slideInDown / slideOutUp, horizontal padding
<Modal position="center">…</Modal>     // fadeIn / fadeOut, horizontal padding (default)
<Modal position="fullscreen">…</Modal> // edge-to-edge
```

Explicit `animationIn` / `animationOut` always override the position default. `center` and `top` ship with `paddingHorizontal: 16` so dialogs don't touch the screen edges; `bottom` and `fullscreen` stay edge-to-edge for sheets and lightboxes.

### 🎨 Styling — wrap your content

The Modal's `style` prop applies to the **outer layout container** (matching `react-native-modal`'s convention). Wrap your body in a styled `<View>` so the container stays transparent and the backdrop shows through:

```tsx
// ❌ Wrong — paints the whole screen white
<Modal isVisible position="bottom" style={{ backgroundColor: "white" }}>
  <Text>Bottom sheet</Text>
</Modal>

// ✅ Right — only the inner view is white
<Modal isVisible position="bottom">
  <View style={{ backgroundColor: "white", padding: 24, borderTopLeftRadius: 24 }}>
    <Text>Bottom sheet</Text>
  </View>
</Modal>
```

## 🪝 Imperative API

For modals you don't want wired to render state:

```tsx
import { useModal, Modal } from "react-native-modalkit";

const Screen = () => {
  const modal = useModal();

  return (
    <>
      <Button title="Open" onPress={modal.show} />
      <Modal ref={modal.ref} swipeDirection="down" onSwipeComplete={modal.hide}>
        <Sheet onClose={modal.hide} />
      </Modal>
    </>
  );
};
```

`useModal()` returns:

| Key             | What it is                                            |
| --------------- | ----------------------------------------------------- |
| `ref`           | pass to `<Modal ref={...} />`                         |
| `show()` / `hide()` / `toggle()` | imperative controls                  |
| `isVisible`     | current visibility (synchronous read)                 |
| `isVisibleProp` | convenience for a controlled `<Modal isVisible={…} />` |

## 🌍 Global modals — `ModalProvider` + `ModalManager`

Mount a queue-aware `<ModalProvider>` at the app root and dispatch from anywhere — no state, no prop drilling:

```tsx
// App.tsx
import { ModalProvider } from "react-native-modalkit";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalProvider>
        <AppNavigator />
      </ModalProvider>
    </GestureHandlerRootView>
  );
}
```

```tsx
// anywhere — even outside React
import { ModalManager, Modal } from "react-native-modalkit";

const id = ModalManager.show(
  <Modal isVisible position="bottom" onBackdropPress={() => ModalManager.hide(id)}>
    <ConfirmDialog />
  </Modal>,
);
```

### 💬 Promise-based dialogs

```tsx
const ok = await ModalManager.confirm({ title: "Delete?", destructive: true });
if (ok) {
  await ModalManager.alert({ title: "Deleted" }); // safe to chain — no stacking
}
```

## ⏱️ Lifecycle & chaining

Callbacks fire in this order on every close:

1. `onModalWillHide` — close animation about to start
2. close animation runs (`animationOutTiming`)
3. native `<Modal>` dismisses (iOS plays its dismiss; Android instant)
4. `onModalHide` and `onDismiss` — **only after** the native window is fully gone

That last point is the fix for the classic "screen unresponsive after close" bug: `onModalHide` is your *safe-to-dispatch-the-next-modal* signal. Follow-up alerts, navigation, or another sheet all run against a clean iOS modal stack:

```tsx
<Modal
  isVisible={visible}
  onBackdropPress={() => setVisible(false)}
  onModalHide={() => {
    ModalManager.alert({ title: "Saved!" }); // previous modal fully gone
  }}
>
  …
</Modal>
```

## 🧾 Props reference

All `react-native-modal` props are supported. modalkit-specific additions:

| Prop                   | Type                                            | Default    | Notes                                                    |
| ---------------------- | ----------------------------------------------- | ---------- | -------------------------------------------------------- |
| `position`             | `"center" \| "top" \| "bottom" \| "fullscreen"` | `"center"` | Layout + animation defaults shortcut                     |
| `respectReducedMotion` | `boolean`                                       | `true`     | Skip animations when the OS reduced-motion setting is on |
| `modalTestID`          | `string`                                        | —          | Forwarded to the underlying `<Modal>` host               |

Full surface: [`Modal.types.ts`](./src/components/Modal/Modal.types.ts).

## 📱 Example app

A full showcase (sheets, dialogs, stacked modals, imperative + global flows) lives in [`example/`](./example) — Expo SDK 57, light theme, 3D icons. Reanimated is a native module, so run it as a dev build:

```sh
cd example
npm install
npm run ios      # expo run:ios — or: npm run android
```

## 🤝 Contributing

PRs welcome. Built with [`react-native-builder-bob`](https://github.com/callstack/react-native-builder-bob), linted with oxlint + oxfmt, tested with Jest + RNTL.

```sh
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

## 📄 License

MIT © [Kuray Ogun](https://github.com/kuraydev)
