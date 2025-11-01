console.log("Hello this is my new Nodejs bacnkend application");

const fs = require("fs");

fs.writeFileSync("hello.txt", "Hello from Nodejs, This is a new text file");
