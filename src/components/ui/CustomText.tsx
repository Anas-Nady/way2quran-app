import React from "react";
import { Text } from "react-native";
import { isRTL } from "../../helpers/flexDirection";

const CustomText = ({ children, className, ...props }) => {
  return (
    <Text
      className={`${
        isRTL ? "font-arabic font-bold" : "font-english font-bold"
      } ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
