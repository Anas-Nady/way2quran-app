import React from "react";
import { View, FlatList } from "react-native";
import { useTranslate } from "../helpers/i18nHelper";
import { socialMedia } from "../constants/socialMedia";
import SocialMediaIcons from "../components/AboutUs/SocialMediaIcons";
import { chunkArray } from "../helpers/chunkArray";
import DescriptionCard from "../components/AboutUs/DescriptionCard";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");

  const descriptionList = Array.from({ length: 3 }, (_, index) => ({
    id: (index + 1).toString(),
    text: translate(`about_${index + 1}`),
  }));

  return (
    <View style={{ flex: 1 }} className="w-full bg-gray-800">
      <FlatList
        data={descriptionList}
        ListHeaderComponent={
          <HeadingWithBackButton headingText={translate("aboutTitle")} />
        }
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
