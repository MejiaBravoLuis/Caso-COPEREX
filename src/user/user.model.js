import { Schema, model } from "mongoose";

const UserSchema = Schema (
    {
        username: {
            type: String,
            required: [true, "user is required"],
            maxLength: [ 25, "cant overcome 25 characters" ]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: 8
        },
        role: {
            type: String,
            required: true,
            default: "ADMIN"
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model ("User", UserSchema)