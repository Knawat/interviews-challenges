const { ServiceBroker } = require("moleculer");
let ApiService = require("moleculer-web");

const broker = new ServiceBroker({
  transporter: "nats://hazem_nats_1:4222",
  serializer: "ProtoBuf",
  logLevel: "debug",
  nodeID: "cart-1",
  cacher: "redis://hazem_redis_1:6379",
  logger: console
});

// Create a service
broker.createService({
  name: "user",
  actions: {
    login() {
      
      return "Hello API Gateway!";
    }
  }
});

// Load API Gateway
broker.createService(ApiService);

// Start server
broker.start();
