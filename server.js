const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const app = express();
const PublicPath = path.join(__dirname, 'public');
app.use(express.static(PublicPath));


function grnerateRandomId(){
    return Math.floor("2408"+Math.random()*900).toString();
  }
  
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registration')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Define a schema and model for storing user data
const userSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    image: String,
    liveImage: String,
    registrationId: String
});
const User = mongoose.model('User', userSchema);

// Set up file storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Handle form submission
app.post('/register', upload.single('image'), (req, res) => {
    const registrationId = grnerateRandomId();
    const newUser = new User({
        name: req.body.name,
        mobile: req.body.mobile,
        image: `/uploads/${req.file.filename}`,
        liveImage: req.body.liveImage,
        registrationId: registrationId
    });

    newUser.save().then(() => {
        res.json({ id: registrationId });
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error saving user data');
    });
});

// Display user information
app.get('/user/:id', (req, res) => {
    User.findOne({ registrationId: req.params.id }).then(user => {
        if (user) {
            res.send(`
                <h2>Registration Complete</h2>
                <p>Name: ${user.name}</p>
                <p>Mobile: ${user.mobile}</p>
                <p><img src="${user.image}" alt="Uploaded Image" style="width:200px; height:auto;"></p>
                <p><img src="${user.liveImage}" alt="Captured Image" style="width:200px; height:auto;"></p>
                <p>Registration ID: ${user.registrationId}</p>
            `);
        } else {
            res.status(404).send('User not found');
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error fetching user data');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
