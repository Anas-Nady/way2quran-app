import { View, TextInput } from "react-native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { flexDirection, textDirection } from "../../helpers/flexDirection";

export default function SearchInput({ handleTextDebounce }) {
  const textInputRef = useRef(null);
  const { t } = useTranslation();

  return (
    <View
      className={`w-[70%] ${flexDirection()} items-center justify-between mx-auto my-3 pt-5`}
    >
      <TextInput
        ref={textInputRef}
        onChangeText={handleTextDebounce}
        placeholder={t("search")}
        placeholderTextColor={"lightgray"}
        className={`${textDirection()} pb-1 w-[70%] py-2 border border-gray-500 flex-1 mx-auto text-base px-5 font-semibold tracking-wider rounded-full text-slate-200`}
      />
    </View>
  );
}
