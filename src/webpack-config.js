var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');

module.exports = function (params) {
    const {
        devtool = 'eval-source-map',
        entry,
        environment = 'development',
        context = process.cwd(),
        externals = [],
        outputPath = path.resolve(__dirname),
        outputLibraryTarget = 'umd',
        outputFilename = 'main.js',
        libraryName = 'unnamedComponent',
    } = params || {};

    const IS_PROD = environment === 'production';
    const IS_DEV = environment === 'development';

    let basicConfig = {
        devtool,
        entry,
        mode: environment,
        context,
        output: {
            path: outputPath,
            libraryTarget: outputLibraryTarget,
            devtoolModuleFilenameTemplate: (info) =>
                path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
        },
        plugins: [
            new DefinePlugin({
                CWD: JSON.stringify(process.cwd()),
                outputLibraryTarget,
            }),
        ],
        externals,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|dist)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['babel-preset-react-app'],
                            plugins: ['babel-plugin-named-asset-import'],
                            cacheDirectory: true,
                            ignore: ['node_modules'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use:
                        outputLibraryTarget === 'umd'
                            ? [{ loader: 'raw-loader' }]
                            : [
                                  { loader: 'style-loader' },
                                  { loader: 'css-loader' },
                              ],
                },
            ],
        },
    };

    if (IS_DEV) {
        const template = path.resolve(__dirname, 'templates/playground.html');

        basicConfig.module.rules[0].use.options.plugins = [
            'react-hot-loader/babel',
        ];
        basicConfig.plugins.push(new HtmlWebpackPlugin({ template }));
        basicConfig.plugins.push(new HotModuleReplacementPlugin());
        basicConfig.entry = [
            path.resolve(__dirname, 'templates/playground-entry.js'),
            'webpack-hot-middleware/client',
        ];

        basicConfig.resolve = {
            alias: {
                react: path.resolve(context, './node_modules/react'),
                'react-dom': path.resolve(context, './node_modules/react-dom'),
                'react-hot-loader': path.resolve(
                    context,
                    './node_modules/react-hot-loader'
                ),
                'babel-core': path.resolve(
                    context,
                    './node_modules/@babel/core'
                ),
            },
        };

        basicConfig.optimization = {
            minimize: false,
            splitChunks: {
                cacheGroups: {
                    node_vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        priority: 1,
                    },
                },
            },
        };

        basicConfig.output.filename = '[name].bundle.js';
        basicConfig.output.chunkFilename = '[name].bundle.js';
    }

    if (IS_PROD) {
        basicConfig.output.library = libraryName;
        basicConfig.output.filename = outputFilename;

        basicConfig.externals = {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
                umd: 'react',
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
                umd: 'react-dom',
            },
            squel: {
                root: 'squel',
                commonjs2: 'squel',
                commonjs: 'squel',
                amd: 'squel',
                umd: 'squel',
            },
        };
    }

    return basicConfig;
};
