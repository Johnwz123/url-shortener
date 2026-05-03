import { PrismaClient } from "@prisma/client";
import { createApp } from "./app.js";
import { loadConfig } from "./config/app.config.js";
import { createRepositories } from "./repositories/app.repositories.js";

const config = loadConfig();
const prisma = new PrismaClient();
const repositories = createRepositories(prisma);
const app = createApp({ config, repositories });

const server = app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
