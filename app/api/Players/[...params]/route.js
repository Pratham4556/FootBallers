// app/api/Players/[...params]/route.js
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Player from "@/lib/models/Players";
import connectionString from "@/lib/db";

// Helper function to connect to the database
async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(connectionString);
}

export async function GET(request) {
    try {
        await connectToDatabase();

        // Get URL from request
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        // Remove 'api' and 'Players' from the path parts
        const [club, action, value] = pathParts.slice(2);

        // Validate parameters
        if (!club || !action || action.toLowerCase() !== 'top' || !value) {
            return NextResponse.json({
                success: false,
                error: "Invalid URL format. Expected format: /api/Players/{club}/top/{number}"
            });
        }

        // Parse the limit value
        const limit = parseInt(value, 10);
        if (isNaN(limit) || limit <= 0) {
            return NextResponse.json({
                success: false,
                error: "The 'top' parameter should be a positive integer."
            });
        }

        // Convert camelCase club name back to spaced format
        const clubName = club
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();

        // Fetch players from database
        const players = await Player.find({ club: clubName })
            .sort({ goals: -1 })
            .limit(limit);

        return NextResponse.json({
            success: true,
            data: players
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred while fetching player data."
        });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const data = await request.json();
        
        if (Array.isArray(data)) {
            if (!data.every(player => player.name && player.club && typeof player.goals !== 'undefined')) {
                return NextResponse.json({ 
                    success: false, 
                    message: "All players must have name, club, and goals fields." 
                });
            }

            const insertedPlayers = await Player.insertMany(data);
            return NextResponse.json({ 
                success: true, 
                message: `${insertedPlayers.length} players added successfully`,
                data: insertedPlayers 
            });
        } else {
            if (!data.name || !data.club || typeof data.goals === 'undefined') {
                return NextResponse.json({ 
                    success: false, 
                    message: "All parameters (name, club, goals) are required." 
                });
            }

            const newPlayer = new Player(data);
            await newPlayer.save();
            
            return NextResponse.json({ 
                success: true, 
                message: "Player added successfully", 
                data: newPlayer 
            });
        }
    } catch (error) {
        console.error("Error adding player(s):", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}