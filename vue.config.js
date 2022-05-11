
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: '0.0.0.0',
    allowedHosts: '0.0.0.0',
    port: 8080,
    // https: false,
    open: true,
    // disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' }

  },
  transpileDependencies: [
    'vuetify'
  ],
})



