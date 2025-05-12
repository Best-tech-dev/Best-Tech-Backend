export default () => ({
  port: process.env.PORT || 3000,
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION,
  },
});