import { View, Text } from "react-native";
import { useContext } from "react";
import { ScreenDimensionsContext } from "../../contexts/ScreenDimensionsProvider";

export default function Error({ message }) {
  const { screenWidth: width } = useContext(ScreenDimensionsContext);

  return (
    <View style={{ width }} className="flex-1 p-3 bg-slate-800">
      <View
        className="p-4 mx-auto bg-gray-900 border border-gray-500"
        style={{ width: width * 0.9 }}
      >
        <Text className="text-lg font-semibold text-red-500">{message}</Text>
      </View>
    </View>
  );
}
