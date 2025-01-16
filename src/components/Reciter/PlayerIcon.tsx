import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IPlayerIconProps {
  iconName: IconNameOptions;
  isActive: boolean;
  size?: number;
  onPress: () => void;
  disabled?: boolean;
}

export enum IconNameOptions {
  REPEAT = "repeat",
  PLAY_SKIP_BACK = "play-skip-back",
  PLAY_SKIP_FORWARD = "play-skip-forward",
  PAUSE_CIRCLE = "pause-circle",
  PLAY_CIRCLE = "play-circle",
  SHUFFLE_SHARP = "shuffle-sharp",
}

const PlayerIcon = ({
  iconName,
  isActive,
  size = 27,
  onPress,
  disabled = false,
}: IPlayerIconProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Ionicons
        name={iconName}
        size={size}
        color={isActive ? "#22c55e" : "#9ca3af"}
      />
    </TouchableOpacity>
  );
};

export default PlayerIcon;
