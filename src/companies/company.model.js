import { model, Schema } from "mongoose";

const CompanySchema = new Schema({
    name: {
        type: String,
        required: [true, "Company name is required"],
        unique: true,
        maxLength: [25, "Name cant exceed 25 characters"]
    },
    impact: {
        type: String,
        required: [true, "Impact level is required"],
        enum: ["Low", "Medium", "High"]
    },
    trayectory: {
        type: Number,
        required: [true, "Years of trayectory are required"],
        min : [ 0 , "The year must be a positive number"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    status: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    },
);

export default model ("Company", CompanySchema)