import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import { formatDuration } from "../../helpers/formatTime";
import getName from "../../helpers/getName";
import { isRTL } from "../../helpers/flexDirection";
import TrackPlayer, { State, useProgress } from "react-native-track-player";
import { setupTrackPlayback } from "../../helpers/setupTrackPlayback";
import { useRouter } from "expo-router";
import PlayerIcon, { IconNameOptions } from "./PlayerIcon";
import { IPlayerState, RepeatModeOptions } from "../../types/types";
import CustomText from "../CustomText";

const AudioPlayerModal = () => {
  const { playerState, setPlayerState, toggleModalExpansion } =
    useAudioPlayer();
  const { position, duration } = useProgress();
  const iconColor = "white";
  const router = useRouter();

  const togglePlayPause = async () => {
    try {
      const currentState = await TrackPlayer.getState();
      let updatedState = { ...playerState };

      if (currentState === State.Playing) {
        await TrackPlayer.pause();
        updatedState = { ...updatedState, isPlaying: false };
      } else {
        await TrackPlayer.play();
        if (
          playerState.repeatMode === RepeatModeOptions.OFF &&
          playerState.audioHasEnded
        ) {
          await TrackPlayer.seekTo(0);
        }
        updatedState = {
          ...playerState,
          isPlaying: true,
          audioHasEnded: false,
        };
      }

      setPlayerState(updatedState as IPlayerState);
    } catch (error) {
      console.error("Error handling playback:", error);
    }
  };

  const handleSeek = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const handleNextSurah = async () => {
    setPlayerState((prev) => ({ ...prev, loadingNextPrev: true }));

    try {
      if (playerState.surahIndex < playerState.audioFiles.length - 1) {
        const nextIdx = playerState.surahIndex + 1;
        const nextSurah = playerState.audioFiles[nextIdx];

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
          audioHasEnded: false,
        };

        setPlayerState(updatedPlayerState as IPlayerState);
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
        const prevSurah = playerState.audioFiles[prevIdx];

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
          audioHasEnded: false,
        };

        setPlayerState(updatedPlayerState as IPlayerState);
      }
    } catch (error) {
      console.error("Error playing previous track:", error);
      setPlayerState((prev) => ({ ...prev, loadingNextPrev: false }));
    }
  };

  const closeModal = async () => {
    const updatedState = {
      ...playerState,
      audioFiles: [],
      currentAudio: null,
      isPlaying: false,
      surahIndex: -1,
      isModalVisible: false,
      isModalExpanded: true,
      repeatMode: RepeatModeOptions.OFF,
      reciter: null,
      recitation: null,
      modalHeight: 0,
      audioHasEnded: false,
    };

    setPlayerState(updatedState as IPlayerState);
    await TrackPlayer.reset();
  };

  if (!playerState.isModalVisible) return null;

  const navigateToReciterScreen = () =>
    router.push({
      pathname: "/reciter",
      params: {
        reciterSlug: playerState.reciter.slug,
        recitationSlug: playerState.recitation.slug,
      },
    });

  const handleRepeatMode = (repeatMode: RepeatModeOptions) => {
    setPlayerState((prev) => ({
      ...prev,
      repeatMode:
        prev.repeatMode === repeatMode ? RepeatModeOptions.OFF : repeatMode,
    }));
  };

  return (
    <View
      style={{ position: "relative" }}
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
            playerState.isModalExpanded
              ? "arrow-down-circle"
              : "arrow-up-circle"
          }
          size={30}
          color={iconColor}
        />
      </TouchableOpacity>

      {/* Close Modal Button */}
      <TouchableOpacity
        className={`absolute z-10 top-2 right-3`}
        onPress={closeModal}
      >
        <AntDesign name="closecircleo" size={27} color={iconColor} />
      </TouchableOpacity>

      {/* Expanded View */}
      {playerState.isModalExpanded && (
        <>
          {/* Audio Details */}
          <View className={`flex-row items-center justify-end mx-2`}>
            <View className={`flex-row items-center flex-1 `}>
              <View className="flex-1">
                <TouchableOpacity
                  className="mx-3"
                  onPress={navigateToReciterScreen}
                >
                  <CustomText className={`text-lg text-center text-gray-100`}>
                    {getName(playerState.reciter)}
                  </CustomText>
                </TouchableOpacity>
                <CustomText
                  numberOfLines={1}
                  className={`mt- text-[15px] text-center font-semibold text-gray-100`}
                >
                  {getName(playerState.currentAudio?.surahInfo)}
                </CustomText>
              </View>
            </View>
          </View>
          <View className={`flex-row items-center justify-between w-full`}>
            <CustomText className="text-sm font-notoKufi text-white w-[48px] text-center">
              {formatDuration(position)}
            </CustomText>
            <Slider
              style={{
                flex: 1,
                height: 25,
                marginVertical: 5,
                transform: [{ scaleX: 1 }],
              }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#22c55e"
              maximumTrackTintColor="#9ca3af"
              thumbTintColor="#22c55e"
            />

            <CustomText className="text-sm font-notoKufi text-white w-[48px] text-end">
              {formatDuration(duration)}
            </CustomText>
          </View>
        </>
      )}
      <>
        {/* Playback Controls */}
        <View className={`${!playerState.isModalExpanded && "px-7 mt-7"}`}>
          <View className={`flex-row items-center justify-between w-full`}>
            <View className="flex-row items-center justify-between flex-1">
              <PlayerIcon
                iconName={IconNameOptions.REPEAT}
                size={27}
                isActive={playerState.repeatMode === RepeatModeOptions.ONE}
                onPress={() => handleRepeatMode(RepeatModeOptions.ONE)}
              />

              <PlayerIcon
                iconName={
                  !isRTL
                    ? IconNameOptions.PLAY_SKIP_BACK
                    : IconNameOptions.PLAY_SKIP_FORWARD
                }
                size={30}
                isActive={playerState.surahIndex !== 0}
                onPress={handlePrevSurah}
                disabled={
                  playerState.surahIndex === 0 || playerState.loadingNextPrev
                }
              />

              <PlayerIcon
                iconName={
                  playerState.isPlaying
                    ? IconNameOptions.PAUSE_CIRCLE
                    : IconNameOptions.PLAY_CIRCLE
                }
                size={33}
                isActive={playerState.isPlaying}
                onPress={togglePlayPause}
              />

              <PlayerIcon
                iconName={
                  !isRTL
                    ? IconNameOptions.PLAY_SKIP_FORWARD
                    : IconNameOptions.PLAY_SKIP_BACK
                }
                size={30}
                isActive={
                  playerState.surahIndex !== playerState?.audioFiles.length - 1
                }
                onPress={handleNextSurah}
                disabled={
                  playerState.surahIndex ===
                    playerState?.audioFiles.length - 1 ||
                  playerState.loadingNextPrev
                }
              />

              <PlayerIcon
                iconName={IconNameOptions.SHUFFLE_SHARP}
                size={27}
                isActive={playerState.repeatMode === RepeatModeOptions.ALL}
                onPress={() => handleRepeatMode(RepeatModeOptions.ALL)}
              />
            </View>
          </View>
        </View>
      </>
    </View>
  );
};

export default AudioPlayerModal;
