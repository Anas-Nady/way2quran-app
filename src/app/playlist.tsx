import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { getAllBookmarks, removeBookmark } from "../helpers/bookmarkHandlers";
import EmptyState from "../components/States/EmptyState";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import { useTranslate } from "../helpers/i18nHelper";
import { isPlayerPlaying, togglePlayback } from "../helpers/setupTrackPlayback";
import { IPlaylistBookmark } from "../types/types";
import PlaylistCard from "../components/PlaylistCard";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";

export default function Playlist() {
  const TYPE = "Playlist";
  const [playlists, setPlaylists] = useState([]);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const translate = useTranslate("PlaylistScreen");

  const { playerState, setPlayerState } = useAudioPlayer();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const allBookmarks = await getAllBookmarks(TYPE);
    setPlaylists(allBookmarks?.reverse());
  };

  const handleDeleteBookmark = async (key: string) => {
    await removeBookmark(TYPE, key);

    loadBookmarks();
  };

  const handleToggleSurahs = (key: string) => {
    setExpandedPlaylist(expandedPlaylist === key ? null : key);
  };

  const currentlyPlaying = (playlist: IPlaylistBookmark) =>
    isPlayerPlaying({
      playerState,
      reciterSlug: playlist.reciter.slug,
      recitationSlug: playlist.recitation.slug,
      isPlaylist: true,
    });

  const handlePlayPlaylist = async (playlist: IPlaylistBookmark) =>
    await togglePlayback({
      playerState,
      setPlayerState,
      reciter: playlist.reciter,
      recitation: playlist.recitation,
      audioFiles: playlist.audioFiles,
      currentAudio: playlist.audioFiles[0],
      surahIndex: 0,
      isPlaylist: true,
    });

  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const handleDelete = (playlist: IPlaylistBookmark) => {
    setPlaylistToDelete(playlist);
    setIsDialogVisible(true);
  };

  const onConfirmDelete = () => {
    if (playlistToDelete) {
      handleDeleteBookmark(playlistToDelete.key);
    }
    setIsDialogVisible(false);
    setPlaylistToDelete(null);
  };

  const onCancelDelete = () => {
    setIsDialogVisible(false);
    setPlaylistToDelete(null);
  };

  const renderItem = ({ item: data }: { item: IPlaylistBookmark }) => (
    <PlaylistCard
      data={data}
      expanded={expandedPlaylist === data.key}
      onToggleSurahs={() => handleToggleSurahs(data.key)}
      onDelete={() => handleDelete(data)}
      onPlay={handlePlayPlaylist}
      isCurrentlyPlaying={currentlyPlaying(data)}
    />
  );

  const ListEmptyComponent = () => (
    <EmptyState message={translate("emptyState")} />
  );

  return (
    <View className="flex-1 w-full h-full mx-auto bg-gray-800">
      <FlatList
        data={playlists}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <HeadingWithBackButton headingText={translate("playlists")} />
        }
        style={{ flex: 1 }}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ backgroundColor: "#1f2937" }}
        ListEmptyComponent={ListEmptyComponent}
      />
      <ConfirmationDialog
        isVisible={isDialogVisible}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        message={translate("deleteConfirmation")}
      />
    </View>
  );
}
