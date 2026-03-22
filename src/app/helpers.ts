export {
    getActiveAuctions,
    getEndedAuctions,
    getAuctionById,
    getUserAuctions,
    createAuction,
    updateAuction,
    deleteAuction,
    endAuction,
    getBidsForAuction,
    getMaxBid,
    placeBid,
    deleteBid,
    getUserByUsername,
    getUserById,
    updateUser,
    deleteUser,
    getUserWonAuctions,
    login,
    register,
    adminLogin,
    createAdmin,
    bootstrapAdmin,
    handleInvalidSession,
    getAuctionImages,
    uploadAuctionImage,
};


const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    if (data === null) {
        return defaultValue;
    }
    return JSON.parse(data) as T;
}

const setToLocalStorage = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const BASE_URL: string = "http://192.168.0.190:3000";


const getSessionExpiry = () => {
    return getFromLocalStorage("signed_in_user", { session_expiry: null }).session_expiry;
};

const getAuthToken = () => {
    return getFromLocalStorage("signed_in_user", { token: null }).token;
};

type requestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

type headerOptions = {
    [key: string]: string;
}

const request = async (path: string, options: requestOptions = {}) => {
    const expiry = getSessionExpiry();
    const token = getAuthToken();

    const bodyObj = options.body ? JSON.parse(options.body) : {};
    if (expiry) bodyObj.session_expiry = expiry;

    const method = (options.method || "GET").toUpperCase();

    const headers: headerOptions = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const fetchOptions: requestOptions = {
        headers,
        ...options,
    };

    if (method !== "GET" && method !== "HEAD") {
        fetchOptions.body = JSON.stringify(bodyObj);
    }

    const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
    const body = await res.json();

    if (body.session_status === false) {
        localStorage.removeItem("signed_in_user");
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
    }

    if (!res.ok) {
        throw new Error(body.message || body.error || "Request failed");
    }

    if (!body.success) {
        throw new Error(body.error || "Request failed");
    }

    return body.data ?? body.session_status;
};

const getActiveAuctions = async () => {
    return await request("/api/auctions/active");
};

const getEndedAuctions = async () => {
    return await request("/api/auctions/ended");
};

const getAuctionById = async (id: number) => {
    return await request(`/api/auctions/${id}`);
};

const getUserAuctions = async (userId: number) => {
    return await request(`/api/auctions/user/${userId}`);
};


type CreateAuctionData = {
    title: string;
    description?: string;
    starting_price: number;
    seller_id: number;
    end_time: string; // ISO string
    image_data?: string[]; // array of base64-encoded image strings
}

const createAuction = async (data: CreateAuctionData) => {
    return await request("/api/auctions", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

const updateAuction = async (id: number, data: CreateAuctionData) => {
    return await request(`/api/auctions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

const deleteAuction = async (id: number) => {
    return await request(`/api/auctions/${id}`, { method: "DELETE" });
};

const endAuction = async (id: number) => {
    return await request(`/api/auctions/${id}/end`, { method: "POST" });
};

const getBidsForAuction = async (auctionId: number) => {
    return await request(`/api/auctions/${auctionId}/bids`);
};

const getMaxBid = async (auctionId: number) => {
    return await request(`/api/auctions/${auctionId}/bids/max`);
};

const placeBid = async (data: { auction_id: number; user_id: number; amount: number }) => {
    return await request("/api/bids", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

const deleteBid = async (bidId: number) => {
    return await request(`/api/bids/${bidId}`, { method: "DELETE" });
};

const getUserByUsername = async (username: string) => {
    return await request(`/api/users/${username}`);
};

const getUserById = async (id: number) => {
    return await request(`/api/users/id/${id}`);
};

const updateUser = async (id: number, data: Partial<{ username: string; email: string; password: string }>) => {
    return await request(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

const deleteUser = async (id: number) => {
    return await request(`/api/users/${id}`, { method: "DELETE" });
};

const getUserWonAuctions = async (id: number) => {
    return await request(`/api/users/${id}/won`);
};

const login = async (data: { username: string; password: string }) => {
    return await request("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

const register = async (data: { username: string; email: string; password: string }) => {
    return await request("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

const adminLogin = async (data: { username: string; password: string }) => {
    return await request("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

const createAdmin = async (data: { username: string; email: string; password: string }) => {
    return await request("/api/admin/create", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

const bootstrapAdmin = async (data: { username: string; email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/api/admin/bootstrap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

const getAuctionImages = async (id: number) => {
    // returns array of base64 strings
    return await request(`/api/auctions/${id}/images`);
};

// imageData should be an array of base64-encoded strings
const uploadAuctionImage = async (id: number, imageData: string | string[]) => {
    return await request(`/api/auctions/${id}/images`, {
        method: "POST",
        body: JSON.stringify({ image_data: Array.isArray(imageData) ? imageData : [imageData] }),
    });
};

const handleInvalidSession = async () => {
    const signedInUser = JSON.parse(
        localStorage.getItem("signed_in_user") || "null",
    );
    const expiry = signedInUser?.session_expiry;
    if (!expiry) return false;

    if (new Date(expiry) <= new Date()) {
        localStorage.removeItem("signed_in_user");
        return true;
    }

    try {
        const sessionValid = await request("/api/session/validate", {
            method: "POST",
            body: JSON.stringify({ session_expiry: expiry }),
        });
        return sessionValid; // true if valid, false if expired
    } catch {
        return false;
    }
};
