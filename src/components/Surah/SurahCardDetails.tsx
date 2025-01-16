import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import {
  isBookmarkExists,
  addBookmark,
  getBookmarkData,
} from "../../helpers/bookmarkHandlers";
import getName from "../../helpers/getName";
import { flexDirection } from "../../helpers/flexDirection";
import TrackPlayer from "react-native-track-player";
import { savePlayerState } from "../../helpers/playerStateStorage";
import { setupTrackPlayback } from "../../helpers/setupTrackPlayback";
import trackPlayerService from "../../services/trackPlayer";
import {
  IAudioFile,
  IPlayerState,
  IPlaylistBookmark,
  RepeatModeOptions,
} from "../../types/types";

const SurahCardDetails = ({ surah, surahIndex, reciter, recitation }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const currentSurahIndex = surah.surahNumber - 1;

  const { playerState, setPlayerState } = useAudioPlayer();

  const handleDownload = () => {
    Linking.openURL(surah?.downloadUrl);
  };

  const iconColor = "#fff";

  const togglePlayback = async (surah: IAudioFile) => {
    setPlayerState((prev) => ({ ...prev, playLoading: true }));

    try {
      // If no track is loaded yet
      if (playerState.surahIndex === -1) {
        try {
          await TrackPlayer.getPlaybackState();
        } catch (error) {
          await TrackPlayer.setupPlayer({
            autoHandleInterruptions: true,
          });
          await trackPlayerService();
        }

        await setupTrackPlayback({
          id: surah.surahNumber.toString(),
          url: surah.url,
          title: `${getName(surah?.surahInfo)}`,
          artist: getName(reciter),
          artwork: reciter.photo,
        });

        const updatedPlayerState = {
          ...playerState,
          playLoading: false,
          currentAudio: surah,
          audioFiles: recitation.audioFiles,
          isPlaying: true,
          isModalVisible: true,
          surahIndex,
          reciter: {
            slug: reciter.slug,
            arabicName: reciter.arabicName,
            englishName: reciter.englishName,
            photo: reciter.photo,
          },
          recitation: {
            slug: recitation.recitationInfo.slug,
            arabicName: recitation.recitationInfo.arabicName,
            englishName: recitation.recitationInfo.englishName,
          },
          isPlaylist: false,
          repeatMode: RepeatModeOptions.OFF,
          audioHasEnded: false,
        };

        setPlayerState(updatedPlayerState);
        await savePlayerState(updatedPlayerState);
        return;
      }

      if (
        !playerState.isPlaylist &&
        playerState.surahIndex == currentSurahIndex &&
        playerState.reciter?.slug === reciter?.slug &&
        playerState.recitation?.slug === recitation?.recitationInfo?.slug
      ) {
        let updatedPlayerState = {
          ...playerState,
          playLoading: false,
        };
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
          updatedPlayerState = { ...updatedPlayerState, isPlaying: true };
        }

        await savePlayerState(updatedPlayerState);
        setPlayerState(updatedPlayerState);
        return;
      }

      // If switching to a different track
      await setupTrackPlayback({
        id: surah.surahNumber.toString(),
        url: surah.url,
        title: `${getName(surah?.surahInfo)}`,
        artist: getName(reciter),
        artwork: reciter.photo,
      });

      const updatedPlayerState = {
        ...playerState,
        playLoading: false,
        currentAudio: surah,
        audioFiles: recitation.audioFiles,
        isPlaying: true,
        isModalVisible: true,
        surahIndex,
        reciter: {
          slug: reciter.slug,
          arabicName: reciter.arabicName,
          englishName: reciter.englishName,
          photo: reciter.photo,
        },
        recitation: {
          slug: recitation.recitationInfo.slug,
          arabicName: recitation.recitationInfo.arabicName,
          englishName: recitation.recitationInfo.englishName,
        },
        isPlaylist: false,
        repeatMode: RepeatModeOptions.OFF,
        audioHasEnded: false,
      };

      setPlayerState(updatedPlayerState as IPlayerState);
      await savePlayerState(updatedPlayerState as IPlayerState);
    } catch (error) {
      const updatedState = { ...playerState, playLoading: false };
      setPlayerState(updatedState);
      await savePlayerState(updatedState);
    }
  };

  const isCurrentlyPlaying = () => {
    return (
      playerState.isPlaying &&
      playerState.reciter?.slug === reciter?.slug &&
      playerState.recitation?.slug === recitation?.recitationInfo?.slug &&
      playerState.surahIndex === currentSurahIndex &&
      !playerState.isPlaylist
    );
  };

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    const bookmarkKey = `${reciter.slug}_${recitation.recitationInfo.slug}`;
    const bookmarkExists = await isBookmarkExists("Playlist", bookmarkKey);
    if (bookmarkExists) {
      const bookmarkData = await getBookmarkData("Playlist", bookmarkKey);
      setIsBookmarked(
        bookmarkData.audioFiles.some(
          (s: IAudioFile) => s.surahNumber === surah.surahNumber
        )
      );
    } else {
      setIsBookmarked(false);
    }
  };

  const toggleBookmark = async () => {
    const bookmarkKey = `${reciter.slug}_${recitation.recitationInfo.slug}`;
    const bookmarkExists = await isBookmarkExists("Playlist", bookmarkKey);

    if (bookmarkExists) {
      const bookmarkData = await getBookmarkData("Playlist", bookmarkKey);
      let updatedSurahs: IAudioFile[];
      if (
        bookmarkData.audioFiles.some(
          (s: IAudioFile) => s.surahNumber === surah.surahNumber
        )
      ) {
        updatedSurahs = bookmarkData.audioFiles.filter(
          (s: IAudioFile) => s.surahNumber !== surah.surahNumber
        );
      } else {
        updatedSurahs = [
          ...bookmarkData.audioFiles,
          {
            surahNumber: surah.surahNumber,
            surahInfo: surah.surahInfo,
            url: surah.url,
            downloadUrl: surah.downloadUrl,
          },
        ];
      }
      await addBookmark("Playlist", bookmarkKey, {
        ...bookmarkData,
        audioFiles: updatedSurahs,
      });
    } else {
      const newBookmarkData: IPlaylistBookmark = {
        reciter: {
          slug: reciter.slug,
          arabicName: reciter.arabicName,
          englishName: reciter.englishName,
          photo: reciter.photo,
        },
        recitation: {
          slug: recitation.recitationInfo.slug,
          arabicName: recitation.recitationInfo.arabicName,
          englishName: recitation.recitationInfo.englishName,
        },
        audioFiles: [
          {
            url: surah.url,
            surahNumber: surah.surahNumber,
            surahInfo: surah.surahInfo,
            downloadUrl: surah.downloadUrl,
          },
        ],
        key: bookmarkKey,
      };
      await addBookmark("Playlist", bookmarkKey, newBookmarkData);
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <View
      className={`${flexDirection()} w-[95%] mx-auto relative items-center justify-between p-4 my-1 border rounded-lg border-gray-500 bg-gray-700`}
    >
      <TouchableOpacity
        className={`${flexDirection()} items-center flex-1`}
        onPress={() => togglePlayback(surah)}
        disabled={playerState.playLoading}
      >
        <View
          style={{ transform: [{ rotate: "45deg" }] }}
          className={`${flexDirection()} items-center justify-center mx-2.5 w-9 h-9 bg-green-600`}
        >
          <Text
            style={{ transform: [{ rotate: "-45deg" }] }}
            className="font-semibold text-center text-white text-md"
          >
            {surah?.surahNumber}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-white">
          {getName(surah?.surahInfo)}
        </Text>
      </TouchableOpacity>
      <View
        style={{ gap: 9 }}
        className={`${flexDirection()} items-center justify-center`}
      >
        {/* Audio Play Button */}
        <TouchableOpacity
          disabled={playerState.playLoading}
          onPress={() => togglePlayback(surah)}
        >
          <Ionicons
            name={
              isCurrentlyPlaying()
                ? "pause-circle-outline"
                : "play-circle-outline"
            }
            size={30}
            color={isCurrentlyPlaying() ? "#22c55e" : iconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleBookmark}>
          <MaterialIcons
            name={isBookmarked ? "playlist-add-check" : "playlist-add"}
            size={30}
            color={isBookmarked ? "#22c55e" : iconColor}
          />
        </TouchableOpacity>

        {/* Download Button */}
        <TouchableOpacity onPress={handleDownload}>
          <Feather name="download" size={26} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(SurahCardDetails);
