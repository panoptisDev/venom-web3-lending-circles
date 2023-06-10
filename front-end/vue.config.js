const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    client: {
      webSocketURL: `ws://0.0.0.0:${process.env.VUE_APP_NODE_PORT}/ws`,
    },
    allowedHosts: 'all',
    server: {
      type: 'https',
      // options: {
      //   cert: ...,
      //   key: ...,
      // }
    }
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/main.scss";`
      }
    }
  }
})
