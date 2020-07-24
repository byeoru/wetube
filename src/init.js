import "./db";
import dotenv from "dotenv";
import app from "./app";
import "./models/User";
import "./models/Video";
import "./models/Comment";

dotenv.config();

const {
  env: { PORT },
} = process;

const handleListening = () =>
  console.log(`✅ Listening on: http://localhost${PORT}`);

app.listen(PORT, handleListening);
