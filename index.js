import express from 'express';
import mongoose from 'mongoose';
import userRouter from './CheckUser.Router.js'; 
import dotenv from 'dotenv';
import cors from 'cors'

const app = express();
app.use(express.json()); 
dotenv.config();
app.use(cors());


const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
});





app.use(userRouter);


