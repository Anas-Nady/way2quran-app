import React from "react";
import { TouchableOpacity } from "react-native";
import CustomText from "./CustomText";

const Button = ({ onPress, text, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${
        disabled ? "bg-gray-700" : "bg-green-600"
      } px-5 py-2.5 text-sm font-medium text-center rounded-lg`}
    >
      <CustomText className="text-lg font-semibold text-slate-200">
        {text}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Button;
