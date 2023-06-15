import { Server, Socket } from "socket.io";
import http from "http";

class IO {
    io: Server;
    constructor(server: http.Server) {
        const io = (this.io = new Server(server, {
            pingInterval: 2000,
            pingTimeout: 5000,
        }));
        io.connectTimeout(2000);
        io.on("connection", this.onConnect);
    }

    onConnect = (socket: Socket) => {
        console.log("\n\n\n\tCONNECT");
        console.log(socket.handshake.auth);
        socket.once("disconnect", this.onDisConnect(socket));
        socket.join("game");
        this.roomChange();
    };

    onDisConnect = (socket: Socket) => {
        return (reason: string) => {
            console.log("\n\n\n\tDISCONNECT");
            console.log(socket.handshake.auth, reason);
            socket.leave("game");
            this.roomChange();
        };
    };

    roomChange = async () => {
        const sockets = await this.io.in("game").fetchSockets();

        const gamerList: any[] = [];
        for (const [name, socket] of sockets.entries()) {
            gamerList.push(socket.handshake.auth);
        }
        this.io.to("game").emit("roomChange", {
            size: sockets.length,
            gamer: gamerList,
        });
    };
}

module.exports = IO;
