const API_URL = "http://localhost:5000/api";

export const getAllFoodItems = async () => {
    const res = await fetch(`${API_URL}/food`);
    const data = await res.json();
    return data;
};

export const saveItem = async (formData, token) => {
    const res = await fetch(`${API_URL}/food`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    return await res.json();
};

export const deleteItem = async (id, token) => {
    const res = await fetch(`${API_URL}/food/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return await res.json();
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return await res.json();
};

export const registerUser = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
};

export const createOrder = async (totalAmount, items, token) => {
    const res = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ totalAmount, items }),
    });
    return await res.json();
};

export const verifyPayment = async (paymentData, token) => {
    const res = await fetch(`${API_URL}/orders/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
    });
    return await res.json();
};