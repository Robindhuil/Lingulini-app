"use server";
import { signIn } from "next-auth/react";

export async function signInAction(formData: FormData) {
    try {
        const result = await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false, // Handle redirect manually on client side
        });

        if (result?.error) {
            return { error: "Invalid credentials" }; // Return error for client-side handling
        }

        return { success: true }; // Indicate successful login
    } catch {
        return { error: "Server error occurred" };
    }
}