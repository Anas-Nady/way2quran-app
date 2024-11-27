import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";

export const setupTrackPlayer = async () => {
  try {
    const isInitialized = await TrackPlayer.isServiceRunning();
    if (!isInitialized) {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });
      console.log("Track Player is set up");
    }
    return true;
  } catch (error) {
    console.error("Error setting up Track Player:", error);
    return false;
  }
};

export default async function () {
  TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
      Capability.SeekTo,
    ],

    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],

    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      alwaysPauseOnInterruption: true,
    },
  });
}
