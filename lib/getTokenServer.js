import { headers } from "next/headers"
import { auth } from "./auth"

export const getTokenServer = async () => {
    const {token} = await auth.api.getToken({
        headers: await headers()
    })
    if (!token) {
        throw new Error("Please sign in again.");
    }
    return token
}

export const requireSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session?.user) {
        throw new Error("Please sign in again.");
    }
    return session
}

export const requireAdmin = async () => {
    const session = await requireSession()
    if (session.user.role !== "admin") {
        throw new Error("Admin only.");
    }
    return session
}