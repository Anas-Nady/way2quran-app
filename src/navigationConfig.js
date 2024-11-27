import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  Reciter,
  Reciters,
  Recitations,
  Search,
  Mushaf,
  Surah,
  ContactUs,
  DownloadQuranPDF,
  AboutUs,
  Playlist,
  Favorites,
  PrayerTimes,
} from "./screens";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="DownloadQuranPDF" component={DownloadQuranPDF} />
      <Stack.Screen name="Recitations" component={Recitations} />
      <Stack.Screen name="Reciters" component={Reciters} />
      <Stack.Screen name="Reciter" component={Reciter} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Mushaf" component={Mushaf} />
      <Stack.Screen name="Surah" component={Surah} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="PrayerTimes" component={PrayerTimes} />
    </Stack.Navigator>
  );
}
