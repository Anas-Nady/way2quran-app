import AsyncStorage from "@react-native-async-storage/async-storage";
import { IPlayerState } from "../types/types";

export const savePlayerState = async (playerState: IPlayerState) => {
  try {
    await AsyncStorage.setItem("playerState", JSON.stringify(playerState));
  } catch (error) {
    console.error("Error saving player state:", error);
  }
};
