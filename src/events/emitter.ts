import { EventEmitter } from "events";
import { Server as SocketIOServer } from "socket.io";

class Emitter extends EventEmitter {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    super();
    this.io = io;
  }

}

export default Emitter;