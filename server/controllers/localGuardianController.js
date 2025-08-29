import Localguardian from "../models/Volunteers/Localguardian.js";

export const getLocalGuardian = async (req, res) => {
    try {
        const localguardians = await Localguardian.find();
        res.json(localguardians);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const register = async (req, res) => {
    try {
        const { name, email, phone, location, password, roles } = req.body;

        // a new local guardian
        const localguardian = new Localguardian({ 
            name, 
            email, 
            phone, 
            location, 
            password, 
            roles 
        });

        await localguardian.save();
        res.status(201).json(localguardian);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: "This email is already registered." });
        }
        res.status(500).json({ message: error.message });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Localguardian.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}