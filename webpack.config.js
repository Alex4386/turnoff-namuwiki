const path = require("path");
const glob = require("glob");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;

const filterEntrys = glob.sync("./src/filter/*.ts").reduce((acc, item) => {
    let name = item.replace("./src/", "").replace(".ts", "");
    acc[name] = item;
    return acc;
}, {});

const mainEntrys = glob.sync("./src/*ts").reduce((acc, item) => {
    let name = item.replace("./src/", "").replace(".ts", "");
    acc[name] = item;
    return acc;
}, {});

module.exports = {
    mode: "production",
    entry: Object.assign(filterEntrys, mainEntrys),

    output: {
        path: path.join(__dirname, "lib"),
        filename: "[name].js",
    },
    target: "node",
    resolve: {
        extensions: [".ts", ".json"],
    },
    module: {
        rules: [{ test: /\.ts$/, use: ["ts-loader"], exclude: /node_modules/ }],
    },
    node: { fs: "empty", net: "empty", tls: "empty" },
    plugins: [new CleanWebpackPlugin()],
    optimization: { minimize: false },
};
