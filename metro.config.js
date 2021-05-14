const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const defaultAssetExts = defaultConfig.resolver.assetExts;

defaultConfig.resolver.assetExts = [...defaultAssetExts, "db", "xml"];

module.exports = defaultConfig;
