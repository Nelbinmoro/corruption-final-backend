const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const API_URL = 'http://localhost:5000';

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected");

        // 1. Create/Update Admin
        const email = "auto_admin@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { email },
            { name: "Auto Admin", email, password: hashedPassword, role: "admin" },
            { upsert: true, new: true }
        );
        console.log("Admin user secured.");

        // 2. Create an Officer for testing
        const officerEmail = "auto_officer@example.com";
        await User.findOneAndUpdate(
            { email: officerEmail },
            { name: "Auto Officer", email: officerEmail, password: hashedPassword, role: "officer" },
            { upsert: true }
        );
        console.log("Officer user secured.");

        // 3. Login as Admin
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Admin Login Success");

        // 4. Test GET /officers
        const officersRes = await fetch(`${API_URL}/admin/officers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const officersData = await officersRes.json();

        console.log("Officers fetched:", officersData.length);
        if (officersData.length > 0) {
            console.log("First Officer:", officersData[0]);
            if (officersData[0].activeCases !== undefined) {
                console.log("TEST PASSED: activeCases field present.");
            } else {
                console.error("TEST FAILED: activeCases missing.");
            }
        } else {
            console.error("TEST FAILED: No officers found.");
        }

        process.exit(0);
    } catch (err) {
        console.error("TEST FAILED:", err.message);
        process.exit(1);
    }
};

run();
