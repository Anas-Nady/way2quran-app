import React, { createContext, useState, useContext } from "react";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import getName from "../helpers/getName";
import { setupTrackPlayback } from "../helpers/setupTrackPlayback";
import { IPlayerState, RepeatModeOptions } from "../types/types";

interface IAudioPlayerContext {
  playerState: IPlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<IPlayerState>>;
  toggleModalExpansion: () => Promise<void>;
  getPlayerModalHeight: () => number;
}

const AudioPlayerContext = createContext<IAudioPlayerContext | undefined>(
  undefined
);

export const AudioPlayerProvider = ({ children }) => {
  const [playerState, setPlayerState] = useState<IPlayerState>({
    audioFiles: [],
    currentAudio: null,
    isPlaying: false,
    surahIndex: -1,
    repeatMode: RepeatModeOptions.OFF,
    isModalVisible: false,
    isModalExpanded: false,
    audioHasEnded: false,
    reciter: null,
    recitation: null,
    modalHeight: 80,
    playLoading: false,
    loadingNextPrev: false,
    isPlaylist: false,
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
          setPlayerState(updatedPlayerState as IPlayerState);

          break;

        case Event.RemotePause:
          await TrackPlayer.pause();
          updatedPlayerState = {
            ...playerState,
            isPlaying: false,
          };
          setPlayerState(updatedPlayerState as IPlayerState);

          break;

        case Event.RemoteStop:
          await TrackPlayer.reset();
          updatedPlayerState = {
            ...playerState,
            isPlaying: false,
            audioHasEnded: false,
            currentAudio: null,
            surahIndex: -1,
            isModalVisible: false,
          };

          setPlayerState(updatedPlayerState as IPlayerState);

          break;

        case Event.RemoteSeek:
          await TrackPlayer.seekTo(event.position);
          break;

        case Event.RemoteNext:
          if (
            !playerState?.audioFiles ||
            playerState.surahIndex >= playerState.audioFiles.length - 1
          ) {
            break;
          }

          try {
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
            };

            setPlayerState(updatedPlayerState as IPlayerState);
          } catch (error) {
            console.error("Error handling remote next:", error);
          }
          break;

        case Event.RemotePrevious:
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

            updatedPlayerState = {
              ...playerState,
              currentAudio: prevSurah,
              isPlaying: true,
              surahIndex: prevIdx,
            };
            setPlayerState(updatedPlayerState as IPlayerState);
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
        playerState.surahIndex <= playerState.audioFiles.length - 1 &&
        playerState.repeatMode === RepeatModeOptions.ALL
      ) {
        let nextIdx: number;
        if (playerState.surahIndex === playerState.audioFiles.length - 1) {
          nextIdx = 0;
        } else {
          nextIdx = playerState.surahIndex + 1;
        }
        const nextSurah = playerState.audioFiles[nextIdx];

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
          setPlayerState(updatedPlayerState as IPlayerState);
        } catch (error) {
          const updatedPlayerState = { ...playerState, isPlaying: false };
          setPlayerState(updatedPlayerState as IPlayerState);
        }
      } else if (playerState.repeatMode === RepeatModeOptions.ONE) {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();

        const updatedPlayerState = {
          ...playerState,
          isPlaying: true,
          audioHasEnded: false,
        };
        setPlayerState(updatedPlayerState as IPlayerState);
      } else {
        const updatedPlayerState = {
          ...playerState,
          isPlaying: false,
          audioHasEnded: true,
        };
        setPlayerState(updatedPlayerState as IPlayerState);
      }
    }
  });

  function getPlayerModalHeight() {
    if (playerState.isModalVisible) {
      return playerState.isModalExpanded ? 165 : 80;
    }
    return 0;
  }

  const toggleModalExpansion = async () => {
    const updatedPlayerState = {
      ...playerState,
      isModalExpanded: !playerState.isModalExpanded,
      modalHeight: playerState.isModalExpanded ? 165 : 80,
    };
    setPlayerState(updatedPlayerState as IPlayerState);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playerState,
        setPlayerState,
        toggleModalExpansion,
        getPlayerModalHeight,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext<IAudioPlayerContext | undefined>(
    AudioPlayerContext
  );
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
