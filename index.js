const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt');
const session = require("express-session");
const usersModel = require('./models/users');
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(session({
    secret: "Odirle",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000,
    }
}));

mongoose.connect("mongodb://127.0.0.1:27017/Users", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('MongoDB connected successfully');
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after a few minutes",
});

app.use("/Login", limiter);
app.use("/Signup", limiter);


function isAdmin(req, res, next) {

    const isAdminRequest = req.headers.authorization === 'Notcapricons';

    if (isAdminRequest) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
}

app.post('/Login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usersModel.findOne({ email: email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.user = user;
                res.json("success");
            } else {
                res.json("The password is incorrect");
            }
        } else {
            res.json("No record existed");
        }
    } catch (err) {
        console.error(err);
        res.json(err);
    }
});

app.post('/Signup', async (req, res) => {
    console.log('Received signup request:', req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 5);

    try {
        const user = await usersModel.create({ ...req.body, password: hashedPassword });
        console.log("User created:", user);
        req.session.user = user;
        res.json(user);
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

app.get('/dashboard/checkAccess', (req, res) => {
    if (req.session.user && req.session.user.dashboardAccess) {
        res.json({ success: true });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

// Admin route to grant access to the dashboard
app.post('/grantDashboardAccess/:userId', isAdmin, async (req, res) => {
    const userId = req.params.userId;

    try {
        
        await usersModel.findByIdAndUpdate(userId, { dashboardAccess: true });

        res.json({ success: true, message: 'Dashboard access granted successfully' });
    } catch (error) {
        console.error('Error granting dashboard access:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

const port = 4004;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
