import { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAllBookmarks, removeBookmark } from "../helpers/bookmarkHandlers";
import EmptyState from "../components/States/EmptyState";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import { useTranslate } from "../helpers/i18nHelper";
import { flexDirection } from "../helpers/flexDirection";
import getName from "../helpers/getName";

export default function Favorites() {
  const TYPE = "Favorites";
  const navigation = useNavigation();
  const [bookmarks, setBookmarks] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);
  const translate = useTranslate("FavoritesScreen");

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const allBookmarks = await getAllBookmarks(TYPE);
    setBookmarks(allBookmarks);
  };

  const handleDeleteBookmark = async (reciterSlug) => {
    await removeBookmark(TYPE, reciterSlug);
    loadBookmarks();
  };

  const handleDelete = (bookmark) => {
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

  const renderItem = ({ item: bookmark }) => (
    <View
      className={`${flexDirection()} w-[95%] mx-auto px-3 py-2 my-2 border rounded-xl bg-gray-700 border-gray-500`}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Reciter", {
            reciterSlug: bookmark.reciterSlug,
            recitationSlug: bookmark.recitationSlug,
          })
        }
        className={`${flexDirection()} justify-center flex-1`}
      >
        <Image
          className="rounded-full"
          style={{ width: 80, height: 80 }}
          source={{
            uri: bookmark.photo,
          }}
          alt={getName(bookmark)}
        />
        <Text className="flex-1 mx-3 mt-2 text-lg font-semibold text-white">
          {getName(bookmark)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(bookmark)}>
        <AntDesign name="delete" size={25} color="#ef4444" />
      </TouchableOpacity>
    </View>
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
    <View className="flex-1 w-full bg-gray-800">
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.reciterSlug}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#1f2937" }}
        ListHeaderComponent={renderHeader}
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
