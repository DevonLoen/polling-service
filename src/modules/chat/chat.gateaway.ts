import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

// Tentukan port atau biarkan kosong agar berjalan di port yg sama dgn NestJS
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  handleConnection(client: Socket) {
    this.logger.log(`🟢 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔴 Client disconnected: ${client.id}`);
  }

  /**
   * Ini adalah "listener" yang menunggu event 'joinRoom' dari client.
   * Ini HANYA akan tereksekusi jika client MENGIRIM event 'joinRoom'.
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomCode: string, // Ini adalah 'code' (nanoid) yg dikirim client
    @ConnectedSocket() client: Socket,
  ) {
    // 3. Masukkan client ke dalam room logis di Socket.IO
    //    'roomCode' ini (misal: 'A4T81Z9B1C') didapat dari client
    client.join(roomCode);

    this.logger.log(`Client ${client.id} joined room: ${roomCode}`);

    // (Opsional) Kirim pesan balasan HANYA ke client yg baru join
    client.emit(
      'joinedSuccessfully',
      `Anda berhasil bergabung ke room ${roomCode}`,
    );
  }

  @SubscribeMessage('pesanKeRoom')
  handleMessageRoom(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Pesan ke room ${data.room} dari ${client.id}: ${data.message}`,
    );

    // Ini adalah baris yang mengirim pesan ke User 2 (dan semua orang di room)
    // 'pesanDariRoom' adalah event yang akan didengar oleh client
    this.server.to(data.room).emit('pesanDariRoom', {
      senderId: client.id,
      message: data.message,
    });
  }

  // (Nanti Anda bisa tambahkan handler @SubscribeMessage('vote') di sini)
}
