import {io} from 'socket.io-client';
import {API_URL} from '../config/api';
import {SOCKET_EVENTS} from '../constants/socketEvents';

export function connectLeadSocket(handlers = {}){
  const socket = io(API_URL, {
   transports: ['websocket'],
   reconnection: true,
   timeout: 10000,
});


socket.on(SOCKET_EVENTS.CONNECT, () => {
   handlers.onConnect?.();
});

socket.on(SOCKET_EVENTS.DISCONNECT, () =>{
  handlers.onDisconnect?.();
});

socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
    handlers.onConnectError?.(error);
  });

  socket.on(SOCKET_EVENTS.NEW_LEAD, (lead) => {
    handlers.onNewLead?.(lead);
  });

return socket;

}
