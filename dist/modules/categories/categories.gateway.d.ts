import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class CategoriesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleSubscribe(client: Socket, data: any): {
        event: string;
        message: string;
    };
    broadcastCategoryUpdate(category: any): void;
    broadcastSubcategoryCreated(subcategory: any, parentCategoryId: string): void;
    broadcastCategoriesUpdate(categories: any[]): void;
}
