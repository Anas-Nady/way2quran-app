import TrackPlayer from "react-native-track-player";

export const setupTrackPlayback = async ({
  id,
  url,
  title,
  artist,
  artwork,
}) => {
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
