const express = require("express");
const app = express();
const routes = require("./routes");

const port = process.env.PORT || 4503;

app.use("/api/v1", routes);
app.listen(port, () => {
  console.log(`The server is listening on port: ${port}`);
});
