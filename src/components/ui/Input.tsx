import React from "react";
import { View, TextInput } from "react-native";
import { textDirection } from "../../helpers/flexDirection";
import CustomText from "../CustomText";

const Input = ({ labelText, id, type, value, onChangeText }) => {
  return (
    <View className="w-full mb-5">
      <CustomText className="mb-2 text-lg font-medium text-center text-gray-200">
        {labelText}
      </CustomText>
      <TextInput
        id={id}
        accessibilityLabel={labelText}
        accessibilityHint={`Provide a ${labelText}`}
        value={value}
        onChangeText={onChangeText}
        keyboardType={type === "email" ? "email-address" : "default"}
        className={`${textDirection()} p-2.5 w-full text-lg  rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-200  text-slate-200`}
      />
    </View>
  );
};

export default Input;
