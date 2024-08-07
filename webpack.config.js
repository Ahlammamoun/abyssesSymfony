const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .enableReactPreset()
    .enablePostCssLoader()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enableSingleRuntimeChunk()
    .addStyleEntry('styles', './assets/app.scss') // Utiliser SCSS
    .enableSassLoader(options => {
        options.sassOptions = {
            quietDeps: true, // Désactiver les avertissements de dépréciation pour les dépendances
        };
    })
    .autoProvidejQuery();

module.exports = Encore.getWebpackConfig();
