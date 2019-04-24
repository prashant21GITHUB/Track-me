const server = require("./server.js");
require("./socket_server.js");
const logger = require("./logger.js");

/**
 * Starting server:
 *  port: 3000
 *  host: localhost
 */
logger.info("Starting application server at port 3000");
server.startServer(3000);
logger.info("Server started");