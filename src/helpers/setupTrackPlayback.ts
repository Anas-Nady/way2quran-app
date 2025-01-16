import TrackPlayer from "react-native-track-player";

interface ISetupTrackPlayback {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
}

export const setupTrackPlayback = async ({
  id,
  url,
  title,
  artist,
  artwork,
}: ISetupTrackPlayback) => {
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
