module.exports = {
    context: __dirname,
    entry: "./index.js",
    output: {
        library: "dominickCore",
        path: __dirname + "/bundle",
        filename: "dominick-core.umd.js",
        libraryTarget: "umd"
    },
    devtool: "#source-map",
    mode: 'production',
    plugins: [],
};