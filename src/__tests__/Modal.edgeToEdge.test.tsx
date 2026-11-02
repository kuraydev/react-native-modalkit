import React from "react";
import { Dimensions, Platform, StyleSheet, Text } from "react-native";
import { render } from "@testing-library/react-native";

import { Modal } from "../components/Modal/Modal";

const WINDOW = { width: 800, height: 360, scale: 1, fontScale: 1 };
const SCREEN = { width: 880, height: 400, scale: 1, fontScale: 1 };

describe("Modal — edge to edge", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.spyOn(Dimensions, "get").mockImplementation((dim) => (dim === "screen" ? SCREEN : WINDOW));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(Platform, "OS", { value: originalOS, configurable: true });
  });

  const setOS = (os: typeof Platform.OS) =>
    Object.defineProperty(Platform, "OS", { value: os, configurable: true });

  const backdropSize = (getByTestId: (id: string) => { props: { style: unknown } }) => {
    const { width, height } = StyleSheet.flatten(
      getByTestId("modalkit-backdrop-visual").props.style as never,
    ) as { width: number; height: number };
    return { width, height };
  };

  it("makes the navigation bar translucent along with the status bar", async () => {
    const { getByTestId } = await render(
      <Modal isVisible statusBarTranslucent modalTestID="host">
        <Text>hello</Text>
      </Modal>,
    );
    expect(getByTestId("host").props.navigationBarTranslucent).toBe(true);
  });

  it("lets navigationBarTranslucent be set on its own", async () => {
    const { getByTestId } = await render(
      <Modal isVisible statusBarTranslucent navigationBarTranslucent={false} modalTestID="host">
        <Text>hello</Text>
      </Modal>,
    );
    expect(getByTestId("host").props.navigationBarTranslucent).toBe(false);
  });

  it("sizes a translucent Android modal from the screen", async () => {
    setOS("android");
    const { getByTestId } = await render(
      <Modal isVisible statusBarTranslucent>
        <Text>hello</Text>
      </Modal>,
    );
    expect(backdropSize(getByTestId as never)).toEqual({ width: 880, height: 400 });
  });

  it("keeps the window size when the navigation bar stays opaque", async () => {
    setOS("android");
    const { getByTestId } = await render(
      <Modal isVisible statusBarTranslucent navigationBarTranslucent={false}>
        <Text>hello</Text>
      </Modal>,
    );
    expect(backdropSize(getByTestId as never)).toEqual({ width: 800, height: 360 });
  });

  it("keeps the window size for opaque Android modals and on iOS", async () => {
    setOS("android");
    const opaque = await render(
      <Modal isVisible>
        <Text>hello</Text>
      </Modal>,
    );
    expect(backdropSize(opaque.getByTestId as never)).toEqual({ width: 800, height: 360 });
    await opaque.unmount();

    setOS("ios");
    const ios = await render(
      <Modal isVisible statusBarTranslucent>
        <Text>hello</Text>
      </Modal>,
    );
    expect(backdropSize(ios.getByTestId as never)).toEqual({ width: 800, height: 360 });
  });
});
