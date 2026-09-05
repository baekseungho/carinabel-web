export function getStoredUser() {
    try {
        const value = localStorage.getItem("user");
        return value ? JSON.parse(value) : null;
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

export function getStoredToken() {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" && token !== "null" ? token : null;
}
