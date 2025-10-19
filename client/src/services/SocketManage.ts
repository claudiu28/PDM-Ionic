import { io, Socket } from "socket.io-client";
import { Plant } from "../types/Plant";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io("http://localhost:8081", {
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('SocketService::Connected with ID:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('SocketService::Disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('SocketService::Connection error:', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('SocketService::Manually disconnected');
    }
  }

  isConnected() {
    return this.socket !== null && this.socket.connected;
  }

  addListener(handlers: {
    onPlantAdded?: (plant: Plant) => void;
    onPlantUpdated?: (plant: Plant) => void;
    onPlantDeleted?: (data: { id: number }) => void;
  }) {
    if (!this.socket) return () => {};

    if (handlers.onPlantAdded) {
      this.socket.on("plantAdded", handlers.onPlantAdded);
    }
    if (handlers.onPlantUpdated) {
      this.socket.on("plantUpdated", handlers.onPlantUpdated);
    }
    if (handlers.onPlantDeleted) {
      this.socket.on("plantDeleted", handlers.onPlantDeleted);
    }

    return () => {
      if (!this.socket) return;
      if (handlers.onPlantAdded) this.socket.off("plantAdded", handlers.onPlantAdded);
      if (handlers.onPlantUpdated) this.socket.off("plantUpdated", handlers.onPlantUpdated);
      if (handlers.onPlantDeleted) this.socket.off("plantDeleted", handlers.onPlantDeleted);
    };
  }
}

export const socketService = new SocketService();