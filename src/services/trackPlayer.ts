import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";

let isPlayerInitialized = false;
let setupPromise: Promise<void> | null = null;

export default async function trackPlayerService() {
  if (isPlayerInitialized) {
    return;
  }

  if (!setupPromise) {
    setupPromise = (async () => {
      await TrackPlayer.setupPlayer();

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

      isPlayerInitialized = true;
    })();
  }

  await setupPromise;
}
