import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { User } from '../../users/domain/user';

@WebSocketGateway({
  cors: {
    origin: '*', // Cho phép mọi nguồn kết nối, có thể thay đổi nếu cần bảo mật.
  },
})
@Injectable()
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  private activeUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        console.log('No token provided, disconnecting client');
        client.disconnect();
        return;
      }

      const decoded: any = jwt.verify(
        token,
        process.env.AUTH_JWT_SECRET ?? 'defaultSeret',
      );
      const userId = decoded.id;

      this.activeUsers.set(userId, client.id);
      console.log(`User ${userId} connected with socketId ${client.id}`);

      // Gửi danh sách online cho tất cả client
      // this.server.emit('activeUsers', Array.from(this.activeUsers.keys()));
    } catch (error) {
      console.log('Invalid token:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.activeUsers.entries()].find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
      this.server.emit('activeUsers', Array.from(this.activeUsers.keys()));
    }
  }

  //   sendMessageToClient(
  //     clientId: string,
  //     messageData: { senderId: string; content: string },
  //   ) {
  //     this.server.to(clientId).emit('new_message', messageData);
  //     console.log('sent message to client');
  //   }

  sendMessageToUser(
    userId: User['id'],
    messageData: { senderId: string; content: string },
  ) {
    const socketId = this.activeUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('new_message', messageData);
      console.log('sent message to client');
    } else {
      console.log(`User ${userId} is offline`);
    }
  }

  sendMatchNotification(userId: string, matchedUserId: string) {
    const socketId = this.activeUsers.get(userId);
    if (socketId) {
      this.server
        .to(socketId)
        .emit('match_notification', { matchedWith: matchedUserId });
      console.log(`Sent match notification to ${userId}`);
    } else {
      console.log(`User ${userId} is offline, cannot send match notification`);
    }
  }
}
