import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { initializeSocket } from './config/socket.js';
import leadRoutes from './routes/lead.routes.js';
import ApiResponse from './utils/ApiResponse.js';
import notFound from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import metaWebhookRoutes from "./routes/metaWebhook.routes.js";
import { startMetaTestLeadPolling } from "./services/metaTestLeadPoller.service.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use("/webhooks/meta", metaWebhookRoutes);
app.use(express.json());

initializeSocket(server);

app.get("/health", (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, {
      database: "connected",
    }, "Backend is healthy")
  );
});

app.use("/api/v1/leads", leadRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async ()=>{
  try{
    await connectDB();
    startMetaTestLeadPolling();

    const PORT = process.env.PORT || 3000;
    server.listen(PORT,"0.0.0.0",()=>{
      console.log(`Server is running on port ${PORT}`);
  });
}catch(error){
      console.error("Failed to start server:", error);
      process.exit(1);
}
};

startServer();
