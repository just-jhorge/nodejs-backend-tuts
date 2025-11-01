const requestHandler = (req, res) => {
  const url = req.url;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Welcome</title></head>");
    res.write(
      "<body><h1>Hello world, I am learning backend development.</h1></body>"
    );
    res.write("</html>");
    return res.end();
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Error</title></head>");
  res.write("<body><h1>Page not found</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
