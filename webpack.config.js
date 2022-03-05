const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
    entry: "./js/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: () => isProduction ? "oneko.min.js" : "oneko.js",
        library: {
            type: "umd",
            name: "oneko",
        }
    },
    devtool: false,
    devServer: {
        open: true,
        host: "localhost",
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }

    return config;
};
