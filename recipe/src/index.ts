import { app } from "./app";

const start = async () => {
  app.listen(3000, () => {
    console.log("recipe service is now listening on port 3000!");
  });
};

start();
