import AsyncStorage from "@react-native-async-storage/async-storage";

export const savePlayerState = async (playerState) => {
  try {
    await AsyncStorage.setItem("playerState", JSON.stringify(playerState));
  } catch (error) {
    console.error("Error saving player state:", error);
  }
};
