import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { flexDirection } from "../../helpers/flexDirection";

const ConfirmationDialog = ({ isVisible, onConfirm, onCancel, message }) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <View
      style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      className="absolute inset-0 items-center justify-center bg-black/70"
    >
      <View className="bg-gray-800 rounded-lg p-5 w-4/5 max-w-[300px]">
        <Text className="mb-5 text-base text-center text-gray-200">
          {message}
        </Text>
        <View className={`${flexDirection()} } justify-between`}>
          <TouchableOpacity
            className="py-2.5 px-5 rounded bg-gray-600"
            onPress={onCancel}
          >
            <Text className="font-bold text-gray-200">{t("cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2.5 px-5 rounded bg-green-600"
            onPress={onConfirm}
          >
            <Text className="font-bold text-white">{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConfirmationDialog;
