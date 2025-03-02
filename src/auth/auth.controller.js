import User from "../user/user.model.js"
import { verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const lowerUsername = username?.toLowerCase() || null;
        if (!lowerUsername) {
            return res.status(400).json({
                msg: "Username is required"
            });
        }

        const user = await User.findOne({ username: lowerUsername });

        if (!user) {
            return res.status(400).json({
                msg: "User not found in Database"
            });
        }

        if (!user.status) {
            return res.status(400).json({
                msg: "This user is not active"
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Incorrect password, try again"
            });
        }

        const token = await generarJWT(user.id);
        return res.status(200).json({
            msg: "Login successful!!!",
            userDetails: {
                username: user.username,
                token: token
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};