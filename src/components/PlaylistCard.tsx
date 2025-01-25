import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import getName from "../helpers/getName";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { IAudioFile } from "../types/types";
import { flexDirection, isRTL, rowDirection } from "../helpers/flexDirection";
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

  const renderSurah = ({ item }: { item: IAudioFile }) => (
    <Text
      style={{ borderWidth: 1, borderRadius: 5, borderColor: "#6b7280" }}
      className="flex-grow p-1 font-semibold text-center text-md text-gray-50"
    >
      {getName(item.surahInfo)}
    </Text>
  );

  const { playerState } = useAudioPlayer();

  const numColumns = 4;
  return (
    <TouchableOpacity
      onPress={onToggleSurahs}
      className="w-[95%] mx-auto mb-4 bg-gray-700 border border-gray-500 rounded-xl"
    >
      <View className={`${flexDirection()} items-center justify-between p-4`}>
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
              columnWrapperStyle={{
                flexDirection: rowDirection(),
              }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, gap: 10 }}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PlaylistCard;
