import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import CustomText from "./CustomText";

const ConfirmationDialog = ({ isVisible, onConfirm, onCancel, message }) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <View
      style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      className="absolute inset-0 items-center justify-center bg-black/70"
    >
      <View className="bg-gray-800 rounded-lg p-5 w-4/5 max-w-[300px]">
        <CustomText className="mb-5 text-base text-center text-gray-200">
          {message}
        </CustomText>
        <View className={`flex-row } justify-between`}>
          <TouchableOpacity
            className="py-2.5 px-5 rounded bg-gray-600"
            onPress={onCancel}
          >
            <CustomText className="font-bold text-gray-200">
              {t("cancel")}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2.5 px-5 rounded bg-green-600"
            onPress={onConfirm}
          >
            <CustomText className="font-bold text-white">
              {t("confirm")}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConfirmationDialog;
