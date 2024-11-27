import { View, Text, TouchableOpacity } from "react-native";
import ReciterImg from "./ReciterImg";
import getName from "./../../helpers/getName";
import { isRTL } from "../../helpers/flexDirection";

const ReciterCard = ({ reciter, handleNavigateClick }) => {
  if (!reciter) {
    return null;
  }
  const limitTextSize = isRTL ? 18 : 16;

  const truncatedName =
    getName(reciter).length > limitTextSize
      ? `${getName(reciter).slice(0, limitTextSize)}...`
      : getName(reciter);

  return (
    <TouchableOpacity
      style={{ flexGrow: 1, paddingVertical: 10 }}
      onPress={handleNavigateClick}
    >
      <View className="w-full">
        <View className="flex-col items-center pb-3">
          <ReciterImg uri={reciter.photo} alt={getName(reciter)} />
        </View>
      </View>
      <Text
        className={`${
          isRTL ? "text-[18px]" : "text-[15px]"
        } font-semibold text-center text-gray-100`}
      >
        {truncatedName}
      </Text>
    </TouchableOpacity>
  );
};

export default ReciterCard;
