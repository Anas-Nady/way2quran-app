import React, { useEffect, useState } from "react";
import TrackPlayer from "react-native-track-player";
import { AudioPlayerProvider } from "../contexts/AudioPlayerContext";
import RootScreenContent from "../screens/root";
import trackPlayer, { setupTrackPlayer } from "../services/trackPlayer";

function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const initializeTrackPlayer = async () => {
      const setup = await setupTrackPlayer();
      setIsPlayerReady(setup);
    };

    initializeTrackPlayer();
  }, []);

  if (!isPlayerReady) {
    return null;
  }

  return (
    <AudioPlayerProvider>
      <RootScreenContent />
    </AudioPlayerProvider>
  );
}

TrackPlayer.registerPlaybackService(() => trackPlayer);

export default App;
