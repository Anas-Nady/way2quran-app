import { View, ScrollView } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helpers/i18nHelper";
import { socialMedia } from "../constants/socialMedia";
import SocialMediaIcons from "../components/AboutUs/SocialMediaIcons";
import { chunkArray } from "../helpers/chunkArray";
import DescriptionList from "../components/AboutUs/DescriptionList";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");

  const descriptionList = Array.from({ length: 3 }, (_, index) => ({
    id: (index + 1).toString(),
    text: translate(`about_${index + 1}`),
  }));

  return (
    <ScrollView
      style={{ flex: 1 }}
      className="w-full bg-gray-800"
      contentContainerStyle={{ gap: 8 }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={translate("aboutTitle")} />
      </View>
      <DescriptionList data={descriptionList} />
      <SocialMediaIcons data={chunkArray(socialMedia, 5)} />
    </ScrollView>
  );
};

export default AboutUsList;
