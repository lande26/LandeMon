import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
import movies from './routes/movies.js'
import shows from './routes/shows.js'
import authRoutes from './routes/auth.route.js'
import {connectDB} from './lib/db.js'  

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use('/api/movies', (req, res) => {
  res.json({ message: 'Movies API endpoint' });
});
app.use('/api/shows', (req, res) => {
  res.json({ message: 'Shows API endpoint' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Movie App API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  connectDB();
})

