import "dotenv/config";

export default () => {
  const isArabic = process.env.LANGUAGE === "ar";

  const arabicConfig = {
    name: "الطريق إلي القرآن",
    slug: "way2quran",
    description:
      "تطبيق الطريق إلى القرآن يتيح لك الاستماع وتحميل تلاوات القرآن الكريم من أفضل القراء في أنحاء العالم الإسلامي.",
    scheme: "way2quran",
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.IDENTIFIER_AR,
      infoPlist: {
        UIBackgroundModes: ["audio"],
        NSLocationWhenInUseUsageDescription:
          "نحن نستخدم موقعك لتحديد المدينة والبلد لعرض أوقات الصلاة بشكل دقيق لك",
        NSDocumentsFolderUsageDescription:
          "يحتاج التطبيق إلى الوصول إلى مجلد المستندات الخاص بك لحفظ صفحات القرآن الكريم.",
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
  };

  const englishConfig = {
    name: "Way2Quran",
    slug: "way2quran-en",
    description:
      "The Way2Quran app allows you to listen to and download Quran recitations by some of the best reciters from across the Islamic world.",
    scheme: "way2quran-en",
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.IDENTIFIER_EN,
      infoPlist: {
        UIBackgroundModes: ["audio"],
        NSLocationWhenInUseUsageDescription:
          "We use your location to determine the city and country to accurately display prayer times for you.",
        NSDocumentsFolderUsageDescription:
          "This app needs access to your documents folder to save Quran pages.",
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
  };

  const commonConfig = {
    version: "1.1.17",
    orientation: "default",
    sdkVersion: "51.0.0",
    icon: "./src/assets/images/ios-icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      backgroundColor: "#fff",
    },
    assetBundlePatterns: ["**/*"],
    android: {
      package: isArabic ? process.env.IDENTIFIER_AR : process.env.IDENTIFIER_EN,
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/android-icon.png",
        backgroundColor: "#374151",
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
        "WAKE_LOCK",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
      ],
    },
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: isArabic
            ? "اسمح للتطبيق باستخدام موقعك لعرض مواقيت الصلاة بشكل دقيق."
            : "Allow this app to use your location to display prayer times.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: isArabic
          ? process.env.EAS_PROJECT_ID_AR
          : process.env.EAS_PROJECT_ID_EN,
      },
      appLanguage: isArabic ? "ar" : "en",
    },
  };

  return {
    ...commonConfig,
    ...(isArabic ? arabicConfig : englishConfig),
  };
};
