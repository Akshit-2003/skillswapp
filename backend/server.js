const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/skillswapp')
  .then(() => console.log('MongoDB Connected Successfully🚀'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('SkillSwap Backend is Running!');
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Register Main Admin Route
app.post('/register-super-admin', async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  // Secret Key Check
  if (secretKey !== 'Skillswap_SUPER_SECRET') {
    return res.status(403).json({ message: 'Invalid Secret Key! Authorization failed.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Role 'Main Admin' set karein
    const newAdmin = new User({ name, email, password, role: 'Main Admin', credits: 9999 });
    await newAdmin.save();

    res.status(201).json({ message: 'Main Admin registered successfully!', user: newAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Teacher Admin Route (by Main Admin)
app.post('/register-teacher-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Role 'Teacher Admin' set karein
    const newAdmin = new User({ name, email, password, role: 'Teacher Admin', credits: 100 }); // Example credits
    await newAdmin.save();

    res.status(201).json({ message: 'Teacher Admin registered successfully!', user: newAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    res.json({ message: 'Login Successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Skill Route
app.post('/add-skill', async (req, res) => {
  try {
    const { email, skill, type } = req.body; // type: 'offered' ya 'wanted'
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (type === 'offered') {
      user.skillsOffered.push(skill);
    } else {
      user.skillsWanted.push(skill);
    }

    await user.save();
    res.json({ message: 'Skill added successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all Teacher Admins
app.get('/get-teacher-admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'Teacher Admin' });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all regular users
app.get('/get-all-users', async (req, res) => {
  try {
    const users = await User.find({ role: 'User' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get platform stats
app.get('/get-platform-stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalAdmins = await User.countDocuments({ role: { $in: ['Teacher Admin', 'Main Admin'] } });
    const totalTeacherAdmins = await User.countDocuments({ role: 'Teacher Admin' });
    const usersWithSkills = await User.find({ 'skillsOffered.0': { '$exists': true } });
    const totalSkills = usersWithSkills.reduce((acc, user) => acc + user.skillsOffered.length, 0);

    res.json({
      totalUsers,
      totalAdmins,
      totalTeacherAdmins,
      totalSkills,
      totalSwaps: 25000 // Mock data as there's no swap model
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all skills on the platform
app.get('/get-all-skills', async (req, res) => {
  try {
    const usersWithSkills = await User.find({ 'skillsOffered.0': { '$exists': true } });
    const allSkills = usersWithSkills.flatMap(user => 
      user.skillsOffered.map(skill => ({
        skillId: `${user._id}-${skill.replace(/\s+/g, '-')}`, // Create a unique ID
        skillName: skill,
        providerName: user.name,
        providerEmail: user.email,
        providerId: user._id,
        status: skill.includes('[Pending Approval') ? 'Pending' : 'Verified'
      }))
    );
    res.json(allSkills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Remove Admin Route
app.delete('/remove-admin/:id', async (req, res) => {
  try {
    // Optional: Add check to prevent main admin from deleting themselves
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Remove User Route
app.delete('/remove-user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port 🤝 ${PORT}`);
});
