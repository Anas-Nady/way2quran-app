import { Text, View } from "react-native";
import { isRTL } from "../helpers/flexDirection";

const HeadingScreen = ({ headingTxt, extraStyles = "" }) => {
  return (
    <View className={`${extraStyles} w-full mx-auto mb-2 mt-8`}>
      <Text
        className={`${
          isRTL ? "text-[40px]" : "text-[30px]"
        } font-bold mx-1 text-center text-green-500`}
      >
        {headingTxt}
      </Text>
      <Text className="w-20 h-1 mx-auto mt-1 bg-gray-600 rounded"></Text>
    </View>
  );
};

export default HeadingScreen;
