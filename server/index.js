import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import cors from "cors"
import { User }  from "./user.model.js"

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/auth_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log("MOngodb connected");


// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log(username,email);
      
      
      // Check if user already exists
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword
      });
  
      await user.save();
  
      // Generate JWT
      const token = jwt.sign(
        { userId: user._id },
        'your_jwt_secret',  // Move to environment variable in production
        { expiresIn: '1h' }
      );
  
      res.status(201).json({ token });
      console.log(user);
      
    } catch (error) {
        console.log(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT
      const token = jwt.sign(
        { userId: user._id },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.listen(5000, () => console.log('Server running on port 5000'));
  