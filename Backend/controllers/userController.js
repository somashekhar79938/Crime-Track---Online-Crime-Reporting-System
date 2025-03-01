import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { username, password, email, age } = req.body;

    if (!username || !password || !email || !age) {
      return res.status(400).json({ error: "Username, password, email, and age are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, age });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logout successful.' });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { email, age } = req.body;

    if (!email || !age) {
      return res.status(400).json({ error: 'Email and age are required.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.email = email;
    user.age = age;
    await user.save();

    res.json({ message: 'User profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};
