import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARK_KEY = "bookmarks";

const getBookmarkObject = async () => {
  const bookmarksJson = await AsyncStorage.getItem(BOOKMARK_KEY);
  return JSON.parse(bookmarksJson) || {};
};

const saveBookmarkObject = async (bookmarkObject: any) => {
  await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarkObject));
};

export const getAllBookmarks = async (type: string) => {
  const bookmarkObject = await getBookmarkObject();
  return Object.values(bookmarkObject[type] || {});
};

export const addBookmark = async (type: string, key: string, data: any) => {
  const bookmarkObject = await getBookmarkObject();
  if (!bookmarkObject[type]) {
    bookmarkObject[type] = {};
  }
  bookmarkObject[type][key] = data;
  await saveBookmarkObject(bookmarkObject);
};

export const removeBookmark = async (type: string, key: string) => {
  const bookmarkObject = await getBookmarkObject();
  if (bookmarkObject[type] && bookmarkObject[type][key]) {
    delete bookmarkObject[type][key];
    await saveBookmarkObject(bookmarkObject);
  }
};

export const isBookmarkExists = async (type: string, key: string) => {
  const bookmarkObject = await getBookmarkObject();
  return !!(bookmarkObject[type] && bookmarkObject[type][key]);
};

export const getBookmarks = async (type: string) => {
  const bookmarkObject = await getBookmarkObject();
  return bookmarkObject[type] ? Object.values(bookmarkObject) : [];
};

export const getBookmarkData = async (type: string, key: string) => {
  const bookmarkObject = await getBookmarkObject();
  return bookmarkObject[type] ? bookmarkObject[type][key] || null : null;
};
