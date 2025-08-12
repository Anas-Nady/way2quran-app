import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import getName from "../helpers/getName";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { IAudioFile } from "../types/types";
import { isRTL } from "../helpers/flexDirection";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "./ui/CustomText";
import CustomImage from "./ui/CustomImage";

const PlaylistCard = ({
  data,
  onToggleSurahs,
  onPlay,
  onDelete,
  expanded,
  isCurrentlyPlaying,
}) => {
  const sortedSurahs = data.audioFiles;
  const { playerState } = useAudioPlayer();

  const renderSurah = ({ item }: { item: IAudioFile }) => {
    const isPlaying =
      String(playerState.currentAudio?.url) === item.url &&
      playerState.isPlaylist;

    return (
      <View
        style={{
          flexGrow: 1,
          padding: 4,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: isPlaying ? "#9ca3af" : "#4b5563",
          backgroundColor: isPlaying ? "#16a34a" : "#1f2937",
          marginHorizontal: 1.5,
          marginVertical: 4,
        }}
      >
        <CustomText className="font-semibold text-center text-md text-gray-50">
          {getName(item.surahInfo)}
        </CustomText>
      </View>
    );
  };

  const numColumns = 4;
  const reciterName = getName(data.reciter);
  return (
    <Pressable className="w-full">
      <TouchableOpacity onPress={onToggleSurahs} className="mt-3">
        <View className="w-[95%] border border-gray-500 rounded-xl mx-auto">
          <View className={`flex-row items-center justify-between p-4`}>
            <CustomImage
              dimensions={80}
              uri={data.reciter.photo}
              alt={reciterName}
            />
            <View className={`flex-1 flex-col justify-start mx-2`}>
              <CustomText
                className={`${
                  isRTL ? "text-xl" : "text-[16px]"
                } text-center text-gray-200`}
              >
                {reciterName}
              </CustomText>
              <CustomText className={`text-sm text-center text-gray-300`}>
                {getName(data.recitation)}
              </CustomText>
            </View>
            <View className={`flex-row items-center justify-between gap-3`}>
              <TouchableOpacity
                disabled={playerState.playLoading}
                onPress={() => onPlay(data)}
              >
                <Ionicons
                  name={
                    isCurrentlyPlaying
                      ? "pause-circle-outline"
                      : "play-circle-outline"
                  }
                  size={30}
                  color={isCurrentlyPlaying ? "#22c55e" : "white"}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash-bin" size={28} color="#E53E3E" />
              </TouchableOpacity>
            </View>
          </View>
          {expanded && (
            <View className="border-t border-gray-600">
              <CustomText
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#6b7280",
                }}
                className="p-1 px-2 mx-auto -mt-3 font-bold text-white text-md"
              >
                {sortedSurahs.length}
              </CustomText>
              <View className={`p-4`}>
                <FlatList
                  data={sortedSurahs}
                  renderItem={renderSurah}
                  keyExtractor={(item) => item?.surahNumber.toString()}
                  numColumns={numColumns}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Pressable>
  );
};

export default PlaylistCard;
