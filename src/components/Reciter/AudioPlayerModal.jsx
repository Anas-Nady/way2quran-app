import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, AppState } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import { formatDuration } from "../../helpers/formatTime";
import getName from "../../helpers/getName";
import {
  flexDirection,
  isRTL,
  rowDirection,
} from "../../helpers/flexDirection";
import TrackPlayer, { State, useProgress } from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePlayerState } from "../../helpers/playerStateStorage";
import { setupTrackPlayback } from "../../helpers/setupTrackPlayback";
import { useRouter } from "expo-router";
import PlayerIcon from "./PlayerIcon";

const AudioPlayerModal = () => {
  const { playerState, setPlayerState, toggleModalExpansion } =
    useAudioPlayer();
  const { position, duration } = useProgress();
  const iconColor = "white";
  const router = useRouter();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === "active") {
        try {
          const playbackState = await TrackPlayer.getPlaybackState();
          const getPlayerState = await AsyncStorage.getItem("playerState");

          if (getPlayerState && playbackState !== State.None) {
            const savedPlayerState = JSON.parse(getPlayerState);
            setPlayerState(savedPlayerState);
            if (savedPlayerState.reciter?.slug) {
              router.push({
                pathname: "reciter",
                params: {
                  reciterSlug: savedPlayerState.reciter.slug,
                },
              });
            }
          } else {
            await AsyncStorage.removeItem("playerState");
          }
        } catch (error) {
          await TrackPlayer.setupPlayer();
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
        if (playerState.repeatMode === "off" && playerState.audioHasEnded) {
          await TrackPlayer.seekTo(0);
        }
        updatedState = {
          ...playerState,
          isPlaying: true,
          audioHasEnded: false,
        };
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
    const updatedState = {
      ...playerState,
      audioFiles: [],
      currentAudio: null,
      isPlaying: false,
      surahIndex: -1,
      isModalVisible: false,
      isModalExpanded: true,
      repeatMode: "off",
      reciter: null,
      recitation: null,
      modalHeight: 0,
      audioHasEnded: false,
    };

    setPlayerState(updatedState);
    await TrackPlayer.reset();
    await savePlayerState(updatedState);
  };

  if (!playerState.isModalVisible) return null;

  const navigateToReciterScreen = () =>
    router.push({
      pathname: "reciter",
      params: {
        reciterSlug: playerState.reciter?.slug,
        recitationSlug: playerState.recitation?.recitationInfo?.slug,
      },
    });

  // HANDLE TRACK PLAYER REPEAT CURRENT AUDIO
  const handleRepeatCurrentAudio = () => {
    setPlayerState((prev) => ({
      ...prev,
      repeatMode: prev.repeatMode === "track" ? "off" : "track",
    }));
  };

  const handleRepeatQueue = () => {
    setPlayerState((prev) => ({
      ...prev,
      repeatMode: prev.repeatMode === "queue" ? "off" : "queue",
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
            playerState?.isModalExpanded
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
      {playerState?.isModalExpanded && (
        <>
          {/* Audio Details */}
          <View className={`${flexDirection()} items-center justify-end mx-2`}>
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
          <View className="flex-row items-center justify-between w-full">
            <Text className="text-sm font-notoKufi text-white w-[48px] text-center">
              {formatDuration(position)}
            </Text>
            <Slider
              style={{
                flex: 1,
                height: 25,
                marginVertical: 10,
                transform: isRTL ? [{ scaleX: -1 }] : [{ scaleX: 1 }],
              }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#22c55e"
              maximumTrackTintColor="#9ca3af"
              thumbTintColor="#22c55e"
            />

            <Text className="text-sm font-notoKufi text-white w-[48px] text-end">
              {formatDuration(duration)}
            </Text>
          </View>
        </>
      )}
      <>
        {/* Playback Controls */}
        <View className={`${!playerState.isModalExpanded && "px-7 mt-7"}`}>
          <View
            className={`${flexDirection()} items-center justify-between w-full`}
          >
            <View
              style={{
                flexDirection: rowDirection(),
              }}
              className={`items-center justify-between flex-1 flex-row-reverse`}
            >
              <PlayerIcon
                iconName="repeat"
                iconLibrary="Feather"
                size={27}
                color={
                  playerState.repeatMode === "track" ? "#22c55e" : "#9ca3af"
                }
                onPress={handleRepeatCurrentAudio}
              />

              <PlayerIcon
                iconName={!isRTL ? "play-skip-back" : "play-skip-forward"}
                size={30}
                color={playerState.surahIndex === 0 ? "#9ca3af" : "#22c55e"}
                onPress={handlePrevSurah}
                disabled={
                  playerState.surahIndex === 0 || playerState.loadingNextPrev
                }
              />

              <PlayerIcon
                iconName={
                  playerState.isPlaying ? "pause-circle" : "play-circle"
                }
                size={33}
                color="#22c55e"
                onPress={togglePlayPause}
              />

              <PlayerIcon
                iconName={!isRTL ? "play-skip-forward" : "play-skip-back"}
                size={30}
                color={
                  playerState.surahIndex ===
                  playerState.recitation?.audioFiles.length - 1
                    ? "#9ca3af"
                    : "#22c55e"
                }
                onPress={handleNextSurah}
                disabled={
                  playerState.surahIndex ===
                    playerState.recitation?.audioFiles.length - 1 ||
                  playerState.loadingNextPrev
                }
              />

              <PlayerIcon
                iconName="shuffle-sharp"
                size={27}
                color={
                  playerState.repeatMode === "queue" ? "#22c55e" : "#9ca3af"
                }
                onPress={handleRepeatQueue}
              />
            </View>
          </View>
        </View>
      </>
    </View>
  );
};

export default AudioPlayerModal;
