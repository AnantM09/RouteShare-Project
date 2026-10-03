// [Purpose] Tell Metro/Babel to use Expo’s preset.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [],
  };
};
