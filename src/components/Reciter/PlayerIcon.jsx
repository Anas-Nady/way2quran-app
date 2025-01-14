import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const PlayerIcon = ({
  iconName,
  iconLibrary = "Ionicons",
  size = 27,
  color = "#9ca3af",
  onPress,
  disabled = false,
}) => {
  const IconComponent = iconLibrary === "Ionicons" ? Ionicons : Feather;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <IconComponent name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default PlayerIcon;
