export function saveItemToLocalStorage(name: string, data: string) {
    if (typeof window !== "undefined") {
        try {
            window.localStorage.setItem(name, data);
        } catch (err) {
            console.error("Cannot save item to local storage");
            return null;
        }
    }
}

export function getItemFromLocalStorage(name: string) {
    if (typeof window !== "undefined") {
        try {
            return window.localStorage.getItem(name);
        } catch (err) {
            console.error("Cannot get item from local storage");
            return null;
        }
    }
    return null;
}

export function removeItemFromLocalStorage(name: string) {
    if (typeof window !== "undefined") {
        try {
            return window.localStorage.removeItem(name);
        } catch (err) {
            console.error("Cannot remove item from local storage");
            return null;
        }
    }
    return null;
}

export function removeItemFromSessionStorage(name: string) {
    if (typeof window !== "undefined") {
        try {
            return window.sessionStorage.removeItem(name);
        } catch (err) {
            console.error("Cannot remove item from session storage");
            return null;
        }
    }
    return null;
}

export function saveItemToSession(key: string, value: any) {
    if (typeof window !== "undefined") {
        try {
            window.sessionStorage.setItem(key, value);
        } catch (err) {
            console.error("Cannot save item to session storage");
        }
    }
}

export function getItemFromSession(key: string) {
    if (typeof window !== "undefined") {
        try {
            return window.sessionStorage.getItem(key);
        } catch (err) {
            console.error("Cannot get item from session storage");
            return null;
        }
    }
    return null;
}

export const asyncSessionStorage = {
    setItem: function (key: any, value: any) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    getItem: function (key: any) {
        return Promise.resolve().then(function () {
            return localStorage.getItem(key);
        });
    },
};