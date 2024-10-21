import http from "node:http";
import path from "node:path";
import dotenv from "dotenv";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import { controller } from "./services/controller";
import { User } from "./types/User.type";
import { getRequestBody } from "./utils/getRequestBody";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

function portIterator(ports: number[]) {
  let index = 0;

  return (): number => {
    const port = ports[index];
    index = (index + 1) % ports.length;
    return port;
  };
}

const numCPUs = availableParallelism() - 1;

const ports = Array.from(
  Array(numCPUs),
  (_item, index) => Number(process.env.PORT) + index + 1
);

const getPort = portIterator(ports);

if (cluster.isPrimary) {
  const balancer = http.createServer((request, response) => {
    const port = getPort();

    console.log("Request to PORT:", port);

    const proxyRequestOptions = {
      hostname: "localhost",
      port: port,
      path: request.url,
      method: request.method,
      headers: request.headers,
    };

    const balancerRequest = http.request(
      proxyRequestOptions,
      (proxyResponse) => {
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers);

        proxyResponse.pipe(response, { end: true });
      }
    );

    request.pipe(balancerRequest, { end: true });
  });

  balancer.listen(process.env.PORT, () => {
    console.log(
      `Load Balancer running at http://localhost:${process.env.PORT}`
    );
  });

  // Forks for new server instances
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Fork for separate DB
  cluster.fork();
} else {
  // DB child process. Used only for storing data as singleton
  if (cluster.worker.id === numCPUs + 1) {
    const DB_USERS: User[] = [];

    http
      .createServer(async (request, response) => {
        const { action, data } = await getRequestBody(request);

        switch (action) {
          case "getUsers": {
            response.writeHead(200, {
              "Content-Type": "application/json",
            });
            response.end(JSON.stringify(DB_USERS));
            return;
          }
          case "addUser": {
            DB_USERS.push(data as User);
            response.end("");
            return;
          }
          case "updateUser": {
            const indexOfUpdatedUser = DB_USERS.findIndex(
              ({ id }) => (data as User).id === id
            );

            DB_USERS[indexOfUpdatedUser] = data as User;

            response.end("");

            return;
          }

          case "deleteUser": {
            const restUsers = DB_USERS.filter(
              ({ id }) => (data as User["id"]) !== id
            );

            DB_USERS.length = 0;

            DB_USERS.push(...restUsers);

            response.end("");

            return;
          }

          default:
            break;
        }
      })
      .listen(1000);
  }
  // Servers child processes. Handles requests
  else {
    const server = http.createServer(async (request, response) => {
      const { statusCode, data } = await controller(request);

      response.writeHead(statusCode, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify(data));
    });

    const port = Number(process.env.PORT) + cluster.worker.id;

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
