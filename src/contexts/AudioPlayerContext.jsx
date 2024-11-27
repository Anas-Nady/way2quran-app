import React, { createContext, useState, useContext } from "react";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import getName from "../helpers/getName";
import { savePlayerState } from "../helpers/playerStateStorage";
import { setupTrackPlayback } from "../helpers/setupTrackPlayback";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [playerState, setPlayerState] = useState({
    audioFiles: [],
    currentAudio: null,
    isPlaying: false,
    surahIndex: -1,
    isModalVisible: false,
    isModalExpanded: false,
    isAutoPlayEnabled: false,
    reciter: null,
    recitation: null,
    modalHeight: 80,
    playLoading: false,
    loadingNextPrev: false,
  });

  useTrackPlayerEvents(
    [
      Event.RemotePlay,
      Event.RemotePause,
      Event.RemoteNext,
      Event.RemotePrevious,
      Event.RemoteStop,
      Event.RemoteSeek,
      Event.RemoteDuck,
    ],
    async (event) => {
      let updatedPlayerState = { ...playerState };

      switch (event.type) {
        case Event.RemotePlay:
          await TrackPlayer.play();
          updatedPlayerState = {
            ...playerState,
            isPlaying: true,
          };
          setPlayerState(updatedPlayerState);
          await savePlayerState(updatedPlayerState);
          break;

        case Event.RemotePause:
          await TrackPlayer.pause();
          updatedPlayerState = {
            ...playerState,
            isPlaying: false,
          };
          setPlayerState(updatedPlayerState);
          await savePlayerState(updatedPlayerState);
          break;

        case Event.RemoteStop:
          await TrackPlayer.reset();
          updatedPlayerState = {
            ...playerState,
            isPlaying: false,
            currentAudio: null,
            surahIndex: -1,
            isModalVisible: false,
          };

          setPlayerState(updatedPlayerState);
          await savePlayerState(updatedPlayerState);
          break;

        case Event.RemoteSeek:
          await TrackPlayer.seekTo(event.position);
          break;

        case Event.RemoteNext:
          if (
            !playerState.recitation?.audioFiles ||
            playerState.surahIndex >=
              playerState.recitation.audioFiles.length - 1
          ) {
            break;
          }

          try {
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
            };

            setPlayerState(updatedPlayerState);
            await savePlayerState(updatedPlayerState);
          } catch (error) {
            console.error("Error handling remote next:", error);
          }
          break;

        case Event.RemotePrevious:
          if (playerState.surahIndex > 0) {
            const prevIdx = playerState.surahIndex - 1;
            const prevSurah = playerState?.recitation?.audioFiles[prevIdx];

            await setupTrackPlayback({
              id: prevSurah.surahNumber.toString(),
              url: prevSurah.url,
              title: getName(prevSurah.surahInfo),
              artist: getName(playerState.reciter),
              artwork: playerState.reciter?.photo,
            });

            updatedPlayerState = {
              ...playerState,
              currentAudio: prevSurah,
              isPlaying: true,
              surahIndex: prevIdx,
            };
            setPlayerState(updatedPlayerState);
            await savePlayerState(updatedPlayerState);
          }
          break;

        case Event.RemoteDuck:
          if (event.paused) {
            await TrackPlayer.pause();
            setPlayerState((prev) => ({ ...prev, isPlaying: false }));
          } else {
            await TrackPlayer.play();
            setPlayerState((prev) => ({ ...prev, isPlaying: true }));
          }
          break;
      }
    }
  );

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    if (event.type === Event.PlaybackQueueEnded) {
      if (
        playerState.isAutoPlayEnabled &&
        playerState.surahIndex < playerState.recitation?.audioFiles.length - 1
      ) {
        const nextIdx = playerState.surahIndex + 1;
        const nextSurah = playerState.recitation.audioFiles[nextIdx];

        try {
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
          };
          setPlayerState(updatedPlayerState);
          await savePlayerState(updatedPlayerState);
        } catch (error) {
          const updatedPlayerState = { ...playerState, isPlaying: false };
          setPlayerState(updatedPlayerState);
          await savePlayerState(updatedPlayerState);
        }
      } else {
        const updatedPlayerState = { ...playerState, isPlaying: false };
        setPlayerState(updatedPlayerState);
        await savePlayerState(updatedPlayerState);
      }
    }
  });

  const toggleModalExpansion = async () => {
    const updatedPlayerState = {
      ...playerState,
      isModalExpanded: !playerState.isModalExpanded,
      modalHeight: playerState.isModalExpanded ? 165 : 80,
    };
    setPlayerState(updatedPlayerState);
    await savePlayerState(updatedPlayerState);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playerState,
        setPlayerState,
        toggleModalExpansion,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
