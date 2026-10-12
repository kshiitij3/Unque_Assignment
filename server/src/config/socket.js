import {Server} from "socket.io";

let io;

export const initializeSocket = (server) =>{
  io = new Server(server,{
    cors:{
      origin: process.env.CLIENT_ORIGIN || "*",
    },
  });

  io.on("connection",(socket)=>{
    console.log("Client connected:", socket.id);

    socket.on("disconnect", ()=>{
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = ()=>{
  if(!io){
    throw new Error("Socker.io has not been initialized");
  }
  else{
    console.log("Socket.io is initialized");
  }
    return io;
}
