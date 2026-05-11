import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace the string below with your new Google AI Studio API Key!
// You only need to change it here, and it will update across all pages automatically.
const API_KEY = "AIzaSyAodhyeS8zSyOXhV8WtXl8z-YP9FEMTdkU";

export const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
