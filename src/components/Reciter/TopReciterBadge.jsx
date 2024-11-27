import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslate } from "./../../helpers/i18nHelper";
import { flexDirection } from "../../helpers/flexDirection";

export default function TopReciterBadge() {
  const translate = useTranslate("ReciterScreen");

  return (
    <View
      className={`${flexDirection()} justify-center items-center gap-1 mt-1`}
    >
      <AntDesign name="star" size={20} color="yellow" />
      <Text className={`text-lg font-bold text-slate-50`}>
        {translate("topReciters")}
      </Text>
    </View>
  );
}
