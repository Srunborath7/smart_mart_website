import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {

    const socket = io("https://smart-mart-api.onrender.com", {
        transports: ["websocket"]
    });

    return {
        provide: {
            socket
        }
    };
});