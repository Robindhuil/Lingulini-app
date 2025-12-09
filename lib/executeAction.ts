"use server";

export async function executeAction({ actionFn }: { actionFn: () => Promise<void> }) {
    try {
        await actionFn();
        return { success: true };
    } catch (error) {
        console.error("Execute Action Error:", error);
        return { error: "Server error occurred" };
    }
}