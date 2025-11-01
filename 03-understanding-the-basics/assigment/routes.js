const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Welcome to my page</title></head>");
    res.write(
      '<body><h1>Hello from this side</h1><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><ul><li>Maame Yeboah</li><li>Obaa Yaa</li><li>Maame Foriwaa</li><li>Georgina</li><li>Junior</li><li>Magdalene</li></ul></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBoody = Buffer.concat(body).toString();
      const message = parsedBoody.split("=")[1];

      console.log(message);

      res.statusCode = 302;
      res.setHeader("Location", "/users");
      return res.end();
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Web Page</title></head>");
  res.write("<body><h3>Unknown page</h3></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
