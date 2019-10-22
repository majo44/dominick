const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: "./index.js",
    output: {
        library: "dominickDom",
        path: __dirname + "/bundle",
        filename: "dominick-dom.umd.js",
        libraryTarget: "umd"
    },
    devtool: "#source-map",
    mode: 'production',
    plugins: [],
    externals: {
        '../core/index.js': {
            commonjs: '@dominick/core',
            commonjs2: '@dominick/core',
            amd: '@dominick/core',
            root: 'dominickCore'
        }
    }
    // optimization: {
    //     minimizer: [
    //         new ClosurePlugin({mode: 'STANDARD'}, {
    //             // compiler flags here
    //             //
    //             // for debuging help, try these:
    //             //
    //             // formatting: 'PRETTY_PRINT'
    //             // debug: true,
    //             // renaming: false
    //         })
    //     ]
    // }

};