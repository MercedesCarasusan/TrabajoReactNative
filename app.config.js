export default {
  expo: {
    name: "trabajo",
    slug: "trabajo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    plugins:[
      [
        "expo-sensors",
        {
          motionPermission: "Allow $(PRODUCT_NAME) to access your device motion"
        }
      ]
    ],

    ios: {
      supportsTablet: true
    },

    android: {
      package: "com.anonymous.trabajo",
      edgeToEdgeEnabled: true,

      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },

      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACTIVITY_RECOGNITION"
      ],

      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },

    web: {
      favicon: "./assets/favicon.png"
    },

    extra: {
      eas: {
        projectId: "f52cda0f-0bb0-4f6a-83f2-fb96e60bf82a"
      }
    }
  }
};