import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARK_KEY = "bookmarks";

const getBookmarkObject = async () => {
  const bookmarksJson = await AsyncStorage.getItem(BOOKMARK_KEY);
  return JSON.parse(bookmarksJson) || {};
};

const saveBookmarkObject = async (bookmarkObject) => {
  await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarkObject));
};

export const getAllBookmarks = async (type) => {
  const bookmarkObject = await getBookmarkObject();
  return Object.values(bookmarkObject[type] || {});
};

export const addBookmark = async (type, key, data) => {
  const bookmarkObject = await getBookmarkObject();
  if (!bookmarkObject[type]) {
    bookmarkObject[type] = {};
  }
  bookmarkObject[type][key] = data;
  await saveBookmarkObject(bookmarkObject);
};

export const removeBookmark = async (type, key) => {
  const bookmarkObject = await getBookmarkObject();
  if (bookmarkObject[type] && bookmarkObject[type][key]) {
    delete bookmarkObject[type][key];
    await saveBookmarkObject(bookmarkObject);
  }
};

export const isBookmarkExists = async (type, key) => {
  const bookmarkObject = await getBookmarkObject();
  return !!(bookmarkObject[type] && bookmarkObject[type][key]);
};

export const getBookmarks = async (type) => {
  const bookmarkObject = await getBookmarkObject();
  return bookmarkObject[type] ? Object.values(bookmarkObject) : [];
};

export const getBookmarkData = async (type, key) => {
  const bookmarkObject = await getBookmarkObject();
  return bookmarkObject[type] ? bookmarkObject[type][key] || null : null;
};
