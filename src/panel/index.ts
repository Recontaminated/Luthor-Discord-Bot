import express from "express";

const app = express();

app.get("/", (request: any, response: any) => {
  return response.sendFile("index.html", { root: "." });
});

app.listen(8888, () =>
  console.log(`App listening at http://localhost:${"8888"}`)
);
