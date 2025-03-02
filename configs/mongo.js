'use strict';

import mongoose from "mongoose";
import User from "../src/user/user.model.js";
import { hash } from "argon2";

export const dbConnection = async () =>{
    try{
        mongoose.connection.on('error', ()=>{
            console.log('Could not be connected to MongoDB');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', ()=>{
            console.log('Try Connecting');
        });

        mongoose.connection.on('connected', async ()=>{
            console.log('connected to MongoDB');

            try {
                const userExists = await User.findOne({ role: "ADMIN" });
                if (!userExists) {
                    const adminPassword = await hash("adminpassword");
                    await User.create({
                        username: "admin",
                        password: adminPassword,
                        role: "ADMIN"
                    });
                    console.log(" ADMIN created in Database");
                } else {
                }

            } catch (error) {
                console.error("Ups, something went wrong trying to create/verify te ADMIN", error);
            }
        });

        mongoose.connection.on('open', ()=>{
            console.log('connected to database');
        });

        mongoose.connection.on('reconnected', ()=>{
            console.log('reconnected to MongoDB');
        });

        mongoose.connection.on('disconnected', ()=>{
            console.log('disconnected');
        });

        mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    }catch(error){
        console.log('Database connection failed' , error);
    }
}