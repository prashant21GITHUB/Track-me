const server = require("./server.js");
require("./socket_server.js");

/**
 * Starting server:
 *  port: 3000
 *  host: localhost
 */
server.startServer(3000, "localhost");