import { ScreenDimensionsProvider } from "../contexts/ScreenDimensionsProvider";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { useCustomFonts } from "../services/font";
import Layout from "../components/Layout";

function RootScreenContent() {
  const { playerState } = useAudioPlayer();
  const { fontsLoaded, error } = useCustomFonts();

  if (!fontsLoaded && !error) return null;

  return (
    <ScreenDimensionsProvider>
      <Layout playerState={playerState} />
    </ScreenDimensionsProvider>
  );
}

export default RootScreenContent;
