require('dotenv').config();
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const productRoutes = require('./routes/productRoutes');
const express=require("express")
const app=express();
const cors = require('cors')
const connectdb=require('./db/db')


app.use(express.json());
app.use(cors());
connectdb();

app.use("/api",signupRoutes);
app.use('/api', loginRoutes);
app.use('/api', productRoutes);
const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log('server is running on port 3001')
})