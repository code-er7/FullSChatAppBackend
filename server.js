import express from 'express';
// import { chats } from './data/data.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './Routes/userRoute.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import chatRoutes from "./Routes/chatRoutes.js"


dotenv.config();
connectDB();
const app = express();
app.use(express.json());



app.get('/' , (req , res)=>{
    res.send("API is working")
});
app.use('/api/user' , userRouter);
app.use('/api/chat' , chatRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT =  process.env.PORT;

app.listen(`${PORT}` , ()=>{
    console.log(`Server is listining on port : ${PORT}`);
})