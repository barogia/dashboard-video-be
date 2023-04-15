import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface MessagePayload {
  text: string;
  roomId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: MessagePayload) {
    const { roomId, text } = payload;
    this.server.to(roomId).emit('getMessage', text);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
  }

  afterInit(server: any) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    //
    console.log(`disconnected ${client.id}`);
  }
}
