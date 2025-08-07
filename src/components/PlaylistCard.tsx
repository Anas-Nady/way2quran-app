import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import getName from "../helpers/getName";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { IAudioFile } from "../types/types";
import { flexDirection, isRTL } from "../helpers/flexDirection";
import { Ionicons } from "@expo/vector-icons";

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

  const renderSurah = ({ item }: { item: IAudioFile }) => (
    <Text
      className={`border rounded flex-grow p-1 font-semibold text-center text-md text-gray-50 mx-[1px] my-1 ${
        String(playerState.currentAudio?.url) === item.url
          ? "bg-green-500 broder-gray-400"
          : "bg-gray-800 border-gray-600 border"
      }`}
    >
      {getName(item.surahInfo)}
    </Text>
  );

  const numColumns = 4;
  return (
    <Pressable className="w-full">
      <TouchableOpacity onPress={onToggleSurahs} className="mt-3">
        <View className="w-[95%] border border-gray-500 rounded-xl mx-auto">
          <View
            className={`${flexDirection()} items-center justify-between p-4`}
          >
            <Image
              source={{ uri: data.reciter.photo }}
              className="w-20 h-20 rounded-full"
            />
            <View className={`flex-1 flex-col justify-start mx-2`}>
              <Text
                className={`${
                  isRTL ? "text-xl" : "text-[16px]"
                } font-bold text-center text-gray-200`}
              >
                {getName(data.reciter)}
              </Text>
              <Text className={`text-sm text-center text-gray-200`}>
                {getName(data.recitation)}
              </Text>
            </View>
            <View
              className={`${flexDirection()} items-center justify-between gap-3`}
            >
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
              <Text
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#6b7280",
                }}
                className="p-1 px-2 mx-auto -mt-3 font-bold text-white text-md"
              >
                {sortedSurahs.length}
              </Text>
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
