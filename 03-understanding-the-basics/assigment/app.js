const http = require("http");

const requestHandler = require("./routes");

const app = http.createServer(requestHandler);

app.listen(3001);
