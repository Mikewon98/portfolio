type configType = {
  api: string;
};

const config: configType = {
  api: `${process.env.NEXT_PUBLIC_STRAPI_URL}`,
};

export default config;
