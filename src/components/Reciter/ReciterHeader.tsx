import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { flexDirection } from "../../helpers/flexDirection";
import ReciterImg from "./ReciterImg";
import getName from "../../helpers/getName";
import SelectOptions from "./SelectOptions";
import TopReciterBadge from "./TopReciterBadge";
import GoBackButton from "./../ui/GoBackButton";
import { deviceLanguage } from "../../services/i18next";

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
      <View
        className={`${
          Platform.OS === "ios" && deviceLanguage === "ar"
            ? "flex-row-reverse"
            : "flex-row"
        } items-center justify-between`}
      >
        <GoBackButton />
        <TouchableOpacity
          disabled={favouriteState.loading}
          onPress={handleFavoriteToggle}
          className="px-3 pt-3"
        >
          <AntDesign
            name="heart"
            size={35}
            color={favouriteState.isFavourite ? "#22c55e" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
      <View className="reciter">
        {/* Reciter Info */}
        <View className="flex-col items-center w-full">
          <ReciterImg uri={reciter?.photo} alt={getName(reciter)} />
          <View className="my-2">
            <Text className="px-2 text-3xl font-semibold text-center text-slate-200">
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
          <Text
            style={{ borderWidth: 1, borderRadius: 8, borderColor: "#4b5563" }}
            className="w-[90%] p-2 mx-auto text-2xl font-semibold text-center text-gray-200"
          >
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
