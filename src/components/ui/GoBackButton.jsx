import { Pressable, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function GoBackButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      className="absolute z-10 left-3 top-2"
      onPress={() => navigation.goBack()}
    >
      <View className="p-1 bg-green-500 rounded-xl">
        <Entypo name="forward" size={24} color="white" />
      </View>
    </Pressable>
  );
}
