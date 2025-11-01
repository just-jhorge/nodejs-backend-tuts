const http = require("http");

const requestHandler = require("./route");

const app = http.createServer(requestHandler);

app.listen(3001);
