import React from "react";
import TrackPlayer from "react-native-track-player";
import { AudioPlayerProvider } from "../contexts/AudioPlayerContext";
import RootScreenContent from "../screens/root";
import trackPlayer from "../services/trackPlayer";

function App() {
  return (
    <AudioPlayerProvider>
      <RootScreenContent />
    </AudioPlayerProvider>
  );
}

TrackPlayer.registerPlaybackService(() => trackPlayer);

export default App;
