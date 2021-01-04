import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import ExplorerService from "./services/Explorer";
import ExplorerController from "./controllers/ExplorerController";
import AuthController from "./controllers/AuthController";
import cors from "cors";
import helmet from "helmet";

const app = express();
const port = process.env.PORT || 3002;

//Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

function handlePostConnectionSetup() {
  //Routes
  app.use("/auth", AuthController);
  app.use("/explorer", ExplorerController);

  console.log("Listening at port " + port);
}

function generateDummyRecords() {
  [
    { id: 1, name: "root", type: "folder", parent: null },
    { id: 2, name: "File1", type: "file", parent: 1 },
    { id: 3, name: "Folder1", type: "folder", parent: 1 },
    { id: 4, name: "File2", type: "file", parent: 3 },
    { id: 5, name: "Folder2", type: "folder", parent: 3 },
  ].map((content) => {
    ExplorerService.save(content);
  });

  // const user = new Users();
  // user.username = "prashant";
  // user.password = "prashant";
  // user.save();
}

const connectionObject = {
  type: "mysql",
  url: process.env.DATABASE_URL || "mysql://root:root@localhost:3306/mydb",
  synchronize: true,
  entities: ["dist/entity/*.js"],
};

createConnection(connectionObject)
  .then(async (connection) => {
    app.listen(port, handlePostConnectionSetup);
    generateDummyRecords();
  })
  .catch((error) => console.log("Error: ", error));
