const ApiGateway = require("moleculer-web");

module.exports = {
  name: "api",
  mixins: [ApiGateway],
  settings: {
    port: process.env.PORT || 3000,
    ip: process.env.IP,
    routes: [
      {
        path: "/api",
        aliases: {},
        authentication: false,
        bodyParsers: {
          json: {
            strict: false,
            limit: "1MB",
          },
          urlencoded: {
            extended: true,
            limit: "1MB",
          },
        },
        mappingPolicy: "restrict", // Available values: "all", "restrict"
        logging: true,
      },
    ],
    log4XXResponses: false,
    logRequestParams: "info",
    logResponseData: "info",
    assets: {
      options: {},
    },
  },
  methods: {},
};
