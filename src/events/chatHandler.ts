import { Server as SocketIOServer, Socket } from "socket.io";
import Emitter from "./emitter";


class EventHandler {
  //@ts-ignore
  private io: SocketIOServer;
  private Emitter: Emitter;

  constructor(io: SocketIOServer, Emitter: Emitter) {
    this.io = io;
    this.Emitter = Emitter;
    this.initialize();
  }

  private initialize() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("disconnect", () => {
        console.log`(Client disconnected: ${socket.id})`;
      });

      socket.on("connect", () => {
        console.log`(Client connected: ${socket.id})`;
      });



      socket.on("sendmessage", (data) => {
        this.Emitter.emit("", {
          title: "your message was received",
          message: "looks good!",
          userId: "23",
        });
      });

    });
    this.Emitter.on("sendmessage", (data) => {
      // this.io.emit("groupmessage", {
      //   id: data?.id,
      //   title: data?.title,
      //   message: data?.message,
      //   userId: data?.userId,
      // });
      console.log("messagesent");
      console.log(data)
    });

    
  }
}

export default EventHandler;