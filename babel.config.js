require('dotenv').config();
const path = require('path');

module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    ["module-resolver", {
      root: ["./src"],
      alias: {
        "@root": "./",
        "@app": "./src",
        "@i18n": "./src/i18n",
        "@assets": "./assets",
        "@utils": "./src/utils",
        "@db": "./src/db",
        "@main": "./src/main",
        "@renderer": "./src/renderer",

        "lyxlib": process.env.LYXLIB_PATH,

        "react": path.resolve(__dirname, "node_modules/react"),
      }
    }]
  ]
}
