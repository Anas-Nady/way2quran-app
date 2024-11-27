import Welcome from "../components/Welcome";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 w-full bg-gray-800">
      <Welcome />
    </View>
  );
}
