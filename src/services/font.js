import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export function useCustomFonts() {
  const [fontsLoaded, error] = useFonts({
    "Noto-Kufi-Arabic": require("./../assets/fonts/NotoKufiArabic.ttf"),
    "Noto-Naskh-Arabic": require("./../assets/fonts/NotoNaskhArabic.ttf"),
    "Public-Sans": require("./../assets/fonts/PublicSans.ttf"),
    "Quran-verse": require("./../assets/fonts/AyatQuran.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  return { fontsLoaded, error };
}
