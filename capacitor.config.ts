const config = {
  appId: "com.fit33.app",
  appName: "Fit33",
  webDir: "public",
  server: {
    url: process.env.CAPACITOR_SERVER_URL ?? "https://fit33-8qvh.vercel.app",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
  },
};

export default config;
