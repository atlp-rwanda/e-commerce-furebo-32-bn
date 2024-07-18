import { Server as SocketIOServer, Socket } from "socket.io";
import Emitter from "./emitter";

class EventHandler {
  private io: SocketIOServer;
  private emitter: Emitter;

  constructor(io: SocketIOServer, emitter: Emitter) {
    this.io = io;
    this.emitter = emitter;
    this.initialize();
  }

  private initialize() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("disconnect", () => {
        console.log`(Client disconnected: ${socket.id})`;
      });

      socket.on("joinPublicChatGroup", () => {
        socket.join("publicChatGroup");
        console.log`(Client ${socket.id} joined public chat group)`;
      });

      socket.on("leavePublicChatGroup", () => {
        socket.leave("publicChatGroup");
        console.log`(Client ${socket.id} left public chat group)`;
      });
    });
      
      this.emitter.on("sendPublicMessage", message => {
          this.io.to("publicChatGroup").emit("groupmessage",message)
      });
  }
}

export default EventHandler;