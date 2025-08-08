import React from "react";
import { View, Pressable, FlatList } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helpers/i18nHelper";
import { socialMedia } from "../constants/socialMedia";
import SocialMediaIcons from "../components/AboutUs/SocialMediaIcons";
import { chunkArray } from "../helpers/chunkArray";
import DescriptionCard from "../components/AboutUs/DescriptionCard";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");

  const descriptionList = Array.from({ length: 3 }, (_, index) => ({
    id: (index + 1).toString(),
    text: translate(`about_${index + 1}`),
  }));

  const ListHeaderComponent = () => (
    <View>
      <GoBackButton />
      <HeadingScreen headingTxt={translate("aboutTitle")} />
    </View>
  );
  return (
    <View style={{ flex: 1 }} className="w-full bg-gray-800">
      <FlatList
        data={descriptionList}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DescriptionCard index={item.id} />}
        contentContainerStyle={{
          backgroundColor: "#1f2937",
        }}
        ListFooterComponent={() => (
          <SocialMediaIcons data={chunkArray(socialMedia, 5)} />
        )}
      />
    </View>
  );
};

export default AboutUsList;
