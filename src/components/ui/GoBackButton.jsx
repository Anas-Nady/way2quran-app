import { Pressable, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { isRTL, rowDirection } from "../../helpers/flexDirection";

export default function GoBackButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      style={{
        flexDirection: rowDirection(),
        justifyContent: isRTL ? "flex-start" : "flex-end",
      }}
      className="px-3 pt-3"
      onPress={() => navigation.goBack()}
    >
      <View className="p-1 bg-green-500 w-[30px] rounded-full">
        <Entypo name="forward" size={22} color="white" />
      </View>
    </Pressable>
  );
}
