const API_URL = 'http://localhost:5000/auth';
const TEST_USER = {
    name: 'Debug User',
    email: 'debug_test@example.com',
    password: 'password123'
};

const run = async () => {
    try {
        console.log("1. Attempting Signup...");
        const signupRes = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        if (signupRes.status === 200) {
            console.log("Signup success.");
        } else {
            const data = await signupRes.json();
            if (data.message === "Email already registered") {
                console.log("User already exists, proceeding to login.");
            } else {
                console.error("Signup failed:", data);
            }
        }

        console.log("2. Attempting Login with MIXED CASE email...");
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "DEBUG_TEST@example.com",
                password: TEST_USER.password
            })
        });

        if (loginRes.ok) {
            const data = await loginRes.json();
            console.log("Login SUCCESS!");
            console.log("Token received:", !!data.token);
            console.log("Role:", data.role);
        } else {
            console.error("Login FAILED");
            console.error("Status:", loginRes.status);
            const data = await loginRes.json();
            console.error("Data:", data);
        }

    } catch (err) {
        console.error("Network or Script Error:", err.message);
    }
};

run();
