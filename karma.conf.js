module.exports = function(config) {
    config.set({
        basePath: '',

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],
        //browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-phantomjs-launcher',
        ]

    })
}

