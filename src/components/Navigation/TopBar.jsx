import { AntDesign, Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import AppTitle from "../AppTitle";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "../../helpers/flexDirection";
import TopBarMenu from "./TopBarMenu";

const TopBar = ({ isMenuOpen, toggleMenu }) => {
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          height: 70,
          position: "relative",
          zIndex: 1,
        }}
        className={`w-full bg-gray-800 border-b-2 border-gray-500 flex-col`}
      >
        <View className={`${flexDirection()} items-center justify-between p-3`}>
          <TouchableOpacity
            onPress={toggleMenu}
            className="px-2 py-1 bg-gray-600 rounded"
          >
            <Feather className="flex" name="menu" size={30} color={"white"} />
          </TouchableOpacity>
          <AppTitle />
          <TouchableOpacity
            className="px-2 py-1 bg-gray-600 rounded"
            onPress={() => navigation.navigate("Search")}
          >
            <AntDesign name="search1" size={30} color={"white"} />
          </TouchableOpacity>
        </View>
        {/* Menu  */}
        {isMenuOpen && (
          <Animated.View
            style={{
              position: "absolute",
              top: 70,
              left: 0,
              zIndex: 10,
            }}
            className="w-full px-3 py-2 bg-gray-800 border-b border-gray-500"
            entering={FadeIn.delay(20).springify()}
          >
            <TopBarMenu closeMenu={toggleMenu} />
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default TopBar;
