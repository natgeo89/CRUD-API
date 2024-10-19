import http from "node:http";
import path from "node:path";
import dotenv from "dotenv";
import { controller } from "./services/controller";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const server = http.createServer(async (request, response) => {
    const { statusCode, data } = await controller(request);

    response.writeHead(statusCode, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify(data));
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
