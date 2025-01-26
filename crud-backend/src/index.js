// index.js
import express from 'express';
import cors from 'cors';
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Роуты для auth
app.use('/api/auth', authRoutes);

// Роуты для задач
app.use('/api', clientRoutes);

app.listen(port, () => {
    console.log("listening on port 3000")
});