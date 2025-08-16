import React from "react";
import { Pressable } from "react-native";
import GoBackButton from "./GoBackButton";
import HeadingScreen from "../HeadingScreen";

interface Props {
  headingText: string;
}

export default function HeadingWithBackButton({ headingText }: Props) {
  return (
    <Pressable>
      <GoBackButton />
      <HeadingScreen headingTxt={headingText} />
    </Pressable>
  );
}
