import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayer } from "../../contexts/AudioPlayerContext";
import {
  isBookmarkExists,
  addBookmark,
  getBookmarkData,
  removeBookmark,
} from "../../helpers/bookmarkHandlers";
import getName from "../../helpers/getName";
import { flexDirection } from "../../helpers/flexDirection";
import {
  isPlayerPlaying,
  togglePlayback,
} from "../../helpers/setupTrackPlayback";
import { IAudioFile, IPlaylistBookmark } from "../../types/types";

const SurahCardDetails = ({ surah, surahIndex, reciter, recitation }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { playerState, setPlayerState } = useAudioPlayer();

  const handleDownload = () => {
    Linking.openURL(surah?.downloadUrl);
  };

  const currentlyPlaying = isPlayerPlaying({
    playerState,
    reciterSlug: reciter.slug,
    recitationSlug: recitation.recitationInfo.slug,
    currentSurahIndex: surahIndex,
    isPlaylist: false,
  });

  const togglePlayPause = async () =>
    await togglePlayback({
      playerState,
      setPlayerState,
      reciter: {
        arabicName: reciter.arabicName,
        englishName: reciter.englishName,
        slug: reciter.slug,
        photo: reciter.photo,
      },
      recitation: {
        arabicName: recitation.recitationInfo.arabicName,
        englishName: recitation.recitationInfo.englishName,
        slug: recitation.recitationInfo.slug,
      },
      audioFiles: recitation.audioFiles,
      currentAudio: surah,
      surahIndex,
      isPlaylist: false,
    });

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
        ].sort((a, b) => a.surahNumber - b.surahNumber);
      }

      if (updatedSurahs.length > 0) {
        await addBookmark("Playlist", bookmarkKey, {
          ...bookmarkData,
          audioFiles: updatedSurahs,
        });
      } else {
        await removeBookmark("Playlist", bookmarkKey);
      }
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
        onPress={togglePlayPause}
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
          onPress={togglePlayPause}
        >
          <Ionicons
            name={
              currentlyPlaying ? "pause-circle-outline" : "play-circle-outline"
            }
            size={30}
            color={currentlyPlaying ? "#22c55e" : "#fff"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleBookmark}>
          <MaterialIcons
            name={isBookmarked ? "playlist-add-check" : "playlist-add"}
            size={30}
            color={isBookmarked ? "#22c55e" : "#fff"}
          />
        </TouchableOpacity>

        {/* Download Button */}
        <TouchableOpacity onPress={handleDownload}>
          <Feather name="download" size={26} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(SurahCardDetails);
