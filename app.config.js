import 'dotenv/config';

export default {
  expo: {
    name: "ZIPGO",
    slug: "ZIPGO",

    extra: {
      apiUrl: process.env.API_URL,   // 👈 access .env value
    }
  }
};
