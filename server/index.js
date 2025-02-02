import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js";
import passwordRoutes from "./routes/password.route.js";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
	origin: "http://localhost:5173", 
	credentials: true 
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get('/test', (req, res) => res.send("Server is running"));
app.use("/api/auth", authRoutes);
app.use('/api', passwordRoutes);


app.listen(PORT, async () => {
	console.log("Server is running on port: ", PORT);
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connection to MongoDB: ", error.message);
		process.exit(1); 
	}
});
