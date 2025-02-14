import { openDB } from "idb";

export const initDB = async () => {
    return await openDB("myAppDB", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "uid" });
            }
        },
    });
};

export const saveUserToDB = async (user) => {
    if (!user) return;
    const db = await initDB();
    const tx = db.transaction("users", "readwrite");
    const store = tx.objectStore("users");
    await store.put(user);
    await tx.done;
};

export const getUserFromDB = async () => {
    const db = await initDB();
    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");
    return await store.get("currentUser");
};
