// app/actions/theme.ts
'use server'

import connectDB from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { revalidatePath } from 'next/cache'

// Function to save the custom theme CSS
export async function saveCustomTheme(css: string) {
    try {
        await connectDB(); // 1. Connect to the database

        // 2. Use Mongoose's findOneAndUpdate to create or update the theme
        await Setting.findOneAndUpdate(
            { key: 'customTheme' }, // Find a document with this key
            { value: css },         // Update its value
            { upsert: true, new: true } // If it doesn't exist, create it. `new: true` returns the new doc.
        );

        // Layout ke cache ko revalidate karein taaki nayi theme load ho
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error('Failed to save theme:', error)
        return { success: false, error: 'Could not save theme.' }
    }
}

// Function to get the custom theme CSS
export async function getCustomTheme() {
    try {
        await connectDB(); // 1. Connect to the database

        // 2. Use Mongoose's findOne to get the theme setting
        const themeSetting = await Setting.findOne({ key: 'customTheme' });

        return themeSetting?.value || '' // Agar theme nahi hai to empty string return karein
    } catch (error) {
        console.error('Failed to get theme:', error)
        return ''
    }
}