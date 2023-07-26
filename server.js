import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";



const app = express();
dotenv.config();
app.use(express.json());

app.get('/', (req,res) => {
    res.send("welcome to Express")
})




const connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongoDB");
    } catch (error) {
        throw error;
    }
}

connect()

mongoose.connection.on("disconnected", () => {
    console.log("mongodb disconnected")
})

app.use(cors())
app.use(cookieParser())
app.use(express.json());



const itemSchema = new mongoose.Schema({
    value: String,
    startDate: Date,
    endDate: Date
})

const Events = mongoose.model('Events', itemSchema);


app.post('/api/events', async (req, res) => {
    try{
        const {value, startDate, endDate} = req.body;
        const newItem = new Events ({ value, startDate, endDate });
        await newItem. save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'failed to add item'});
    }
})



app.get('/api/events', async (req, res) => {
    try{
        const items = await Events.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'failed to fetch  items'});
    }
})



app.put('/api/events/:id', async (req, res) => {
    try{
        const{ id } = req.params;
        const { value } = req.body;

        const updatedItem = await Events.findByIdAndUpdate(id, { value }, { new:true });
        if(!updatedItem) {
            return res.status(404).json({error: 'Item not found'})
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'failed to update item'});
    }
})



app.delete('/api/events/:id', async (req, res) => {
    try{
        const{ id } = req.params;
        const deletedItem = await Events.findByIdAndRemove(id);
        if(!deletedItem) {
            return res.status(404).json({error: 'Item not found'})
        }
        res.json(deletedItem);
    } catch (error) {
        res.status(500).json({ error: 'failed to delete item'});
    }
})










/////////////////////////////////////////////////////////////////////////////////



function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  
  
  
  // Route for user registration
  app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({ username, password: hashedPassword });
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  });
  
  
  
  // Route for user login
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = users.find((u) => u.username === username);
      if (!user) return res.sendStatus(404);
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.sendStatus(401);
  
      const token = jwt.sign({ username: user.username }, SECRET_KEY);
      res.json({ token });
    } catch (error) {
      res.sendStatus(500);
    }
  });
  


  app.use("/api/v1/user", require("./routes/userRoutes"));
  
  app.get('/home', authenticateToken, (req, res) => {
    res.send(`Welcome, ${req.user.username}!`);
  });














const port = 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})