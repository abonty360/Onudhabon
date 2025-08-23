import Localguardian from "../models/Volunteers/Localguardian.js";

export const getLocalGuardian = async (req, res) => {
    try {
        const localguardians = await Localguardian.find();
        res.json(localguardians);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const newLocalGuardian = async (req, res) => {
    try {
        const { name, email } = req.body;
        const localguardian = new Localguardian({ name, email });
        await localguardian.save();
        res.status(201).json(localguardian);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}