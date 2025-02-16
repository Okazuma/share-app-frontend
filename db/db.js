import { openDB } from "idb";

const DB_NAME = "myAppDB";
const STORE_NAME = "users";

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

export const deleteUserFromDB = async () => {
    try {
        const db = await openDB(DB_NAME, 1);
        await db.delete(STORE_NAME, "currentUser");
        console.log("🗑 キャッシュを削除しました");
    } catch (error) {
        console.error("❌ キャッシュ削除エラー:", error);
    }
};