const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.watcher.additionalExts.push("mjs", "cjs");

module.exports = config;
