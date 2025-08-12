import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Pressable } from "react-native";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import { AntDesign } from "@expo/vector-icons";
import { getAllBookmarks, removeBookmark } from "../helpers/bookmarkHandlers";
import EmptyState from "../components/States/EmptyState";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import { useTranslate } from "../helpers/i18nHelper";

import getName from "../helpers/getName";
import { useRouter } from "expo-router";
import { IFavouriteBookmark } from "../types/types";
import CustomText from "../components/ui/CustomText";
import CustomImage from "../components/ui/CustomImage";

export default function Favorites() {
  const TYPE = "Favorites";
  const [bookmarks, setBookmarks] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);
  const translate = useTranslate("FavoritesScreen");
  const router = useRouter();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const allBookmarks = await getAllBookmarks(TYPE);
    setBookmarks(allBookmarks?.reverse());
  };

  const handleDeleteBookmark = async (reciterSlug: string) => {
    await removeBookmark(TYPE, reciterSlug);
    loadBookmarks();
  };

  const handleDelete = (bookmark: IFavouriteBookmark) => {
    setBookmarkToDelete(bookmark);
    setIsDialogVisible(true);
  };

  const onConfirmDelete = () => {
    if (bookmarkToDelete) {
      handleDeleteBookmark(bookmarkToDelete.reciterSlug);
    }
    setIsDialogVisible(false);
    setBookmarkToDelete(null);
  };

  const onCancelDelete = () => {
    setIsDialogVisible(false);
    setBookmarkToDelete(null);
  };

  const navigateToReciterScreen = (bookmark: IFavouriteBookmark) => {
    router.push({
      pathname: "/reciter",
      params: {
        reciterSlug: bookmark.reciterSlug,
        recitationSlug: bookmark.recitationSlug,
      },
    });
  };
  const renderItem = ({ item: bookmark }: { item: IFavouriteBookmark }) => (
    <Pressable className="w-full">
      <View
        className={`flex-row w-[95%] mx-auto p-3 my-2 border rounded-xl bg-gray-800 border-gray-500`}
      >
        <View className={`justify-center flex-1`}>
          <TouchableOpacity onPress={() => navigateToReciterScreen(bookmark)}>
            <View style={{ alignItems: "center" }}>
              <CustomImage
                uri={bookmark.photo}
                alt={getName(bookmark)}
                dimensions={100}
              />
              <CustomText
                className={`text-center mt-2 text-lg font-semibold text-white`}
              >
                {getName(bookmark)}
              </CustomText>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(bookmark)}
          className="absolute right-3 top-3"
        >
          <AntDesign name="delete" size={25} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={translate("favorites")} />
      </View>
    );
  };

  return (
    <View className="flex-1 w-full h-full mx-auto bg-gray-800">
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.reciterSlug}
        contentContainerStyle={{ backgroundColor: "#1f2937" }}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState message={translate("emptyState")} />}
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
