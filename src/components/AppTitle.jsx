import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const AppTitle = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/")}>
      <View>
        <Text
          style={{ lineHeight: 43 }}
          className="pt-1 text-[26px] text-secondary font-notoKufi"
        >
          {t("wayTo")}
          <Text className="text-green-600">{t("quran")}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppTitle;
