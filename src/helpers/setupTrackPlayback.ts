import TrackPlayer from "react-native-track-player";
import {
  IAudioFile,
  IPlayerRecitation,
  IPlayerReciter,
  IPlayerState,
  RepeatModeOptions,
} from "../types/types";
import getName from "./getName";
import trackPlayerService from "../services/trackPlayer";

interface ISetupTrackPlayback {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
}

export const setupTrackPlayback = async ({
  id,
  url,
  title,
  artist,
  artwork,
}: ISetupTrackPlayback) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id,
      url,
      title,
      artist,
      artwork,
      genre: "Quran",
    });
    await TrackPlayer.updateNowPlayingMetadata({
      artwork,
    });

    await TrackPlayer.play();
    return true;
  } catch (error) {
    console.error("Error setting up Track Player:", error);
    return false;
  }
};

interface IsPlayerPlayingProps {
  playerState: IPlayerState;
  reciterSlug: string;
  recitationSlug: string;
  currentSurahIndex?: number;
  isPlaylist: boolean;
}

export const isPlayerPlaying: React.FC<IsPlayerPlayingProps> = ({
  playerState,
  reciterSlug,
  recitationSlug,
  currentSurahIndex,
  isPlaylist,
}): boolean => {
  const isPlaylistCondition = isPlaylist
    ? playerState.isPlaylist
    : !playerState.isPlaylist && playerState.surahIndex === currentSurahIndex;

  return (
    playerState.isPlaying &&
    playerState.reciter?.slug === reciterSlug &&
    playerState.recitation?.slug === recitationSlug &&
    isPlaylistCondition
  );
};

interface ITogglePlaybackProps {
  playerState: IPlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<IPlayerState>>;
  reciter: IPlayerReciter;
  recitation: IPlayerRecitation;
  audioFiles: IAudioFile[];
  currentAudio: IAudioFile;
  surahIndex: number;
  isPlaylist: boolean;
}

export const togglePlayback = async ({
  playerState,
  setPlayerState,
  reciter,
  recitation,
  audioFiles,
  currentAudio,
  surahIndex,
  isPlaylist,
}: ITogglePlaybackProps) => {
  setPlayerState((prev) => ({ ...prev, playLoading: true }));

  const repeatMode = isPlaylist ? RepeatModeOptions.ALL : RepeatModeOptions.OFF;

  try {
    await trackPlayerService();

    // If no track is playing, start new playlist
    if (playerState.surahIndex === -1) {
      await setupTrackPlayback({
        id: currentAudio.surahNumber.toString(),
        url: currentAudio.url,
        title: getName(currentAudio.surahInfo),
        artist: getName(reciter),
        artwork: reciter.photo,
      });

      const updatedPlayerState = {
        ...playerState,
        playLoading: false,
        currentAudio,
        reciter,
        recitation,
        audioFiles,
        surahIndex,
        isPlaying: true,
        isModalVisible: true,
        repeatMode,
        isPlaylist,
        audioHasEnded: false,
      };

      setPlayerState(updatedPlayerState as IPlayerState);

      return;
    }

    const isPlaylistCondition = isPlaylist
      ? playerState.isPlaylist
      : !playerState.isPlaylist && surahIndex === playerState.surahIndex;

    const isCurrentTrack =
      isPlaylistCondition &&
      playerState.reciter?.slug === reciter.slug &&
      playerState.recitation?.slug === recitation.slug;

    if (isCurrentTrack) {
      let updatedPlayerState = { ...playerState, playLoading: false };

      if (playerState.isPlaying) {
        await TrackPlayer.pause();
        updatedPlayerState = { ...updatedPlayerState, isPlaying: false };
      } else {
        await TrackPlayer.play();
        if (
          playerState.repeatMode === RepeatModeOptions.OFF &&
          playerState.audioHasEnded
        ) {
          await TrackPlayer.seekTo(0);
        }
        updatedPlayerState = {
          ...updatedPlayerState,
          isPlaying: true,
          audioHasEnded: false,
        };
      }

      setPlayerState(updatedPlayerState as IPlayerState);

      return;
    }

    // Switch to new playlist
    await setupTrackPlayback({
      id: currentAudio.surahNumber.toString(),
      url: currentAudio.url,
      title: getName(currentAudio.surahInfo),
      artist: getName(reciter),
      artwork: reciter.photo,
    });

    const updatedPlayerState = {
      ...playerState,
      playLoading: false,
      currentAudio,
      reciter,
      recitation,
      audioFiles,
      surahIndex,
      isPlaying: true,
      repeatMode,
      isPlaylist,
      audioHasEnded: false,
      isModalVisible: true,
    };

    setPlayerState(updatedPlayerState as IPlayerState);

    return;
  } catch (error) {
    const updatedState = { ...playerState, playLoading: false };
    setPlayerState(updatedState as IPlayerState);

    return;
  }
};
