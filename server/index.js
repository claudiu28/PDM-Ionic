const http = require('http');
const express = require('express');
const constants = require('./const/constant');
const cors = require('cors');
const { Server } = require('socket.io');
const routes = require('./routes/PlantsRoutes');
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Plant Care API is running' });
});

app.use("/api/plants", routes);

server.listen(constants.PORT, constants.HOSTNAME, () => {
    console.log(`Server running at ${constants.SERVER}${constants.HOSTNAME}:${constants.PORT}/`);
});