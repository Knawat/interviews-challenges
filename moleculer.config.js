"use strict";

module.exports = {
  namespace: "knawat",
  transporter: "nats://hazem_nats_1:4222",
  logger: true,
  logLevel: "info",
  logFormatter: "short",
  cacher: "redis://hazem_redis_1:6379",
  metrics: true,
  serializer: "ProtoBuf"
};
