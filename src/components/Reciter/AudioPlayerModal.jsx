import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, AppState } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import formatTime from "../../helpers/formatTime";
import getName from "../../helpers/getName";
import { flexDirection } from "../../helpers/flexDirection";
import TrackPlayer, { State, useProgress } from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePlayerState } from "../../helpers/playerStateStorage";
import { setupTrackPlayback } from "../../helpers/setupTrackPlayback";

const AudioPlayerModal = () => {
  const { playerState, setPlayerState, toggleModalExpansion } =
    useAudioPlayer();
  const { position, duration } = useProgress();
  const iconColor = "white";
  const navigation = useNavigation();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === "active") {
        const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();

        try {
          const getPlayerState = await AsyncStorage.getItem("playerState");
          if (getPlayerState && activeTrackIndex !== undefined) {
            const savedPlayerState = JSON.parse(getPlayerState);
            setPlayerState(savedPlayerState);
            if (savedPlayerState?.reciter?.slug) {
              navigation.navigate("Reciter", {
                reciterSlug: savedPlayerState.reciter.slug,
              });
            }
          }
        } catch (error) {
          console.error("Error saving player state:", error);
        }
      }
    };

    handleAppStateChange(AppState.currentState);
  }, [setPlayerState]);

  const togglePlayPause = async () => {
    try {
      const currentState = await TrackPlayer.getState();
      let updatedState = { ...playerState };

      if (currentState === State.Playing) {
        await TrackPlayer.pause();
        updatedState = { ...updatedState, isPlaying: false };
      } else {
        await TrackPlayer.play();
        updatedState = { ...playerState, isPlaying: true };
      }

      setPlayerState(updatedState);
      await savePlayerState(updatedState);
    } catch (error) {
      console.error("Error handling playback:", error);
    }
  };

  const handleSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const handleNextSurah = async () => {
    setPlayerState((prev) => ({ ...prev, loadingNextPrev: true }));

    try {
      if (
        playerState.surahIndex <
        playerState.recitation.audioFiles.length - 1
      ) {
        const nextIdx = playerState.surahIndex + 1;
        const nextSurah = playerState.recitation.audioFiles[nextIdx];

        await setupTrackPlayback({
          id: nextSurah.surahNumber.toString(),
          url: nextSurah.url,
          title: getName(nextSurah.surahInfo),
          artist: getName(playerState.reciter),
          artwork: playerState.reciter?.photo,
        });

        const updatedPlayerState = {
          ...playerState,
          currentAudio: nextSurah,
          isPlaying: true,
          surahIndex: nextIdx,
          loadingNextPrev: false,
        };

        setPlayerState(updatedPlayerState);
        await savePlayerState(updatedPlayerState);
      }
    } catch (error) {
      console.error("Error playing next track:", error);
      setPlayerState((prev) => ({ ...prev, loadingNextPrev: false }));
    }
  };

  const handlePrevSurah = async () => {
    setPlayerState((prev) => ({ ...prev, loadingNextPrev: true }));

    try {
      if (playerState.surahIndex > 0) {
        const prevIdx = playerState.surahIndex - 1;
        const prevSurah = playerState.recitation.audioFiles[prevIdx];

        await setupTrackPlayback({
          id: prevSurah.surahNumber.toString(),
          url: prevSurah.url,
          title: getName(prevSurah.surahInfo),
          artist: getName(playerState.reciter),
          artwork: playerState.reciter?.photo,
        });

        const updatedPlayerState = {
          ...playerState,
          currentAudio: prevSurah,
          isPlaying: true,
          surahIndex: prevIdx,
          loadingNextPrev: false,
        };

        setPlayerState(updatedPlayerState);
        await savePlayerState(updatedPlayerState);
      }
    } catch (error) {
      console.error("Error playing previous track:", error);
      setPlayerState((prev) => ({ ...prev, loadingNextPrev: false }));
    }
  };

  const closeModal = async () => {
    await TrackPlayer.reset();
    const updatedState = {
      ...playerState,
      audioFiles: [],
      currentAudio: null,
      isPlaying: false,
      surahIndex: -1,
      isModalVisible: false,
      isModalExpanded: true,
      isAutoPlayEnabled: false,
      reciter: null,
      recitation: null,
      modalHeight: 0,
    };

    setPlayerState(updatedState);
    await savePlayerState(updatedState);
  };

  if (!playerState.isModalVisible) return null;

  const navigateToReciterScreen = () =>
    navigation.navigate("Reciter", {
      reciterSlug: playerState.reciter?.slug,
      recitationSlug: playerState.recitation?.recitationInfo?.slug,
    });

  return (
    <View
      className={`bg-gray-800 border border-gray-500 border-b-0 rounded-t-3xl ${
        playerState?.isModalExpanded ? "h-[165px] p-5" : "h-[80px] p-2"
      }`}
    >
      {/* Modal Toggle Button */}
      <TouchableOpacity
        className={`absolute z-10 rounded-full top-2 left-3`}
        onPress={toggleModalExpansion}
      >
        <Feather
          name={
            playerState?.isModalExpanded
              ? "arrow-down-circle"
              : "arrow-up-circle"
          }
          size={28}
          color={iconColor}
        />
      </TouchableOpacity>

      {/* Close Modal Button */}
      <TouchableOpacity
        className={`absolute z-10 top-2 right-3`}
        onPress={closeModal}
      >
        <AntDesign name="closecircleo" size={25} color={iconColor} />
      </TouchableOpacity>

      {/* Expanded View */}
      {playerState?.isModalExpanded ? (
        <>
          {/* Audio Details */}
          <View className={`${flexDirection()} items-center justify-end mx-4`}>
            <View className={`${flexDirection()} items-center flex-1 gap-2`}>
              <View className="flex-1">
                <TouchableOpacity
                  className="mx-3"
                  onPress={navigateToReciterScreen}
                >
                  <Text
                    className={` text-[18px] text-center font-bold text-gray-100`}
                  >
                    {getName(playerState.reciter)}
                  </Text>
                </TouchableOpacity>
                <Text
                  numberOfLines={1}
                  className={`mt-1 text-[15px] text-center font-semibold text-gray-100`}
                >
                  {getName(playerState.currentAudio?.surahInfo)}
                </Text>
              </View>
            </View>
          </View>

          {/* Slider */}
          <Slider
            style={{
              width: "100%",
              height: 25,
              marginVertical: 10,
              transform: [{ scaleX: -1 }],
            }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#22c55e"
            maximumTrackTintColor="#9ca3af"
            thumbTintColor="#22c55e"
          />

          {/* Playback Controls */}
          <View
            className={`${flexDirection()} items-center justify-between w-full`}
          >
            <Text className="text-sm text-white w-[48px] text-center">
              {formatTime(position)}
            </Text>
            <View
              className={`${flexDirection()} items-center justify-center gap-2`}
            >
              <TouchableOpacity
                onPress={handlePrevSurah}
                disabled={
                  playerState.surahIndex === 0 || playerState.loadingNextPrev
                }
              >
                <Ionicons
                  name="play-skip-forward"
                  size={24}
                  color={playerState.surahIndex === 0 ? "#9ca3af" : "#22c55e"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                  name={playerState.isPlaying ? "pause-circle" : "play-circle"}
                  size={33}
                  color="#22c55e"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNextSurah}
                disabled={
                  playerState.surahIndex ===
                    playerState.recitation?.audioFiles.length - 1 ||
                  playerState.loadingNextPrev
                }
              >
                <Ionicons
                  name="play-skip-back"
                  size={24}
                  color={
                    playerState.surahIndex ===
                    playerState.recitation?.audioFiles.length - 1
                      ? "#9ca3af"
                      : "#22c55e"
                  }
                />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-white w-[48px]">
              {formatTime(duration)}
            </Text>
          </View>
        </>
      ) : (
        // Collapsed view content
        <View className="px-7">
          <Slider
            style={{
              width: "100%",
              height: 25,
              marginVertical: 10,
              transform: [{ scaleX: -1 }],
            }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#22c55e"
            maximumTrackTintColor="#9ca3af"
            thumbTintColor="#22c55e"
          />

          {/* Playback Controls */}
          <View
            className={`${flexDirection()} items-center justify-between w-full -mt-2`}
          >
            <Text className="text-sm text-white w-[48px] text-center">
              {formatTime(position)}
            </Text>
            <View
              className={`${flexDirection()} items-center justify-center gap-2`}
            >
              <TouchableOpacity
                onPress={handlePrevSurah}
                disabled={
                  playerState.surahIndex === 0 || playerState.loadingNextPrev
                }
              >
                <Ionicons
                  name="play-skip-forward"
                  size={24}
                  color={playerState.surahIndex === 0 ? "#9ca3af" : "#22c55e"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                  name={playerState.isPlaying ? "pause-circle" : "play-circle"}
                  size={28}
                  color="#22c55e"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNextSurah}
                disabled={
                  playerState.surahIndex ===
                    playerState.recitation?.audioFiles.length - 1 ||
                  playerState.loadingNextPrev
                }
              >
                <Ionicons
                  name="play-skip-back"
                  size={24}
                  color={
                    playerState.surahIndex ===
                    playerState.recitation?.audioFiles.length - 1
                      ? "#9ca3af"
                      : "#22c55e"
                  }
                />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-white w-[48px] text-end">
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AudioPlayerModal;
