import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { flexDirection } from "../../helpers/flexDirection";
import ReciterImg from "./ReciterImg";
import getName from "../../helpers/getName";
import GoBackButton from "../ui/GoBackButton";
import SelectOptions from "./SelectOptions";
import TopReciterBadge from "./TopReciterBadge";

const ReciterHeader = ({
  reciter,
  currentRecitation,
  favouriteState,
  downloadRecitation,
  handleRecitationChange,
  handleFavoriteToggle,
  downloadTranslate,
}) => {
  return (
    <>
      <View className={`${flexDirection()} items-center justify-between`}>
        <GoBackButton />
        <TouchableOpacity
          disabled={favouriteState.loading}
          onPress={handleFavoriteToggle}
          className="absolute z-10 top-2 right-3"
        >
          <AntDesign
            name="heart"
            size={40}
            color={favouriteState.isFavourite ? "#22c55e" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
      <View className="mt-5 reciter">
        {/* Reciter Info */}
        <View className="flex-col items-center w-full">
          <ReciterImg uri={reciter?.photo} />
          <View className="my-2">
            <Text className="px-2 text-3xl font-semibold text-center text-slate-300">
              {getName(reciter)}
            </Text>
            {reciter?.isTopReciter && <TopReciterBadge />}
            <View
              className={`${flexDirection()} items-center justify-center gap-2 mt-1`}
            >
              <Ionicons name="eye-outline" size={25} color="#6B7280" />
              <Text className="mb-1 ml-1 text-lg font-semibold text-slate-300">
                {reciter?.totalViewers?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Select Options */}
        {reciter?.recitations?.length > 1 ? (
          <SelectOptions
            setRecitation={handleRecitationChange}
            recitations={reciter?.recitations}
            recitationName={getName(currentRecitation?.recitationInfo)}
          />
        ) : (
          <Text className="w-[90%] p-2 mx-auto text-2xl font-semibold text-center text-gray-200 border border-gray-600 rounded">
            {getName(currentRecitation?.recitationInfo)}
          </Text>
        )}
        {/* Download All Button */}
        <TouchableOpacity
          onPress={downloadRecitation}
          className="w-[95%] mx-auto p-4 mt-4 bg-gray-700 border border-gray-500 rounded-md"
        >
          <Text className="ml-2 text-lg font-semibold text-center text-slate-100">
            {downloadTranslate}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default React.memo(ReciterHeader);
