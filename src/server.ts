import Fastify from "fastify";
import prisma from "./prisma";

const server = Fastify();

server.get("/", async (request, reply) => {
  return { message: "Hello, Fastify with TypeScript!" };
});

server.post("/create-group", async (request, reply) => {
  const { name, participants } = request.body as {
    name: string;
    participants: { name: string; email: string }[];
  };

  try {
    const group = await prisma.group.create({
      data: {
        name,
        participants: {
          create: participants,
        },
      },
      include: { participants: true },
    });

    return reply.status(201).send(group);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Failed to create group" });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log("🚀 Server is running on http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();     
