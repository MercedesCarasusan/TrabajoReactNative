export default {
  expo: {
    name: "MotionTrack",
    slug: "trabajo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/MotionTrack.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./assets/MotionTrack.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    plugins:[
      [
        "expo-sensors",
        {
          motionPermission: "Allow $(PRODUCT_NAME) to access your device motion"
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Permite que la app seleccione fotos para adjuntarlas al entrenamiento",
          cameraPermission: "Permite que la app use la camara para adjuntar fotos al entrenamiento",
          microphonePermission: false
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
        foregroundImage: "./assets/MotionTrack.png",
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
