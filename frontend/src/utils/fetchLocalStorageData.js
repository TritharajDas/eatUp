export const fetchUser = () => {
    const userInfo = localStorage.getItem("user");
    return userInfo ? JSON.parse(userInfo) : null;
};

export const fetchCart = () => {
    const cartInfo = localStorage.getItem("cartItems");
    return cartInfo ? JSON.parse(cartInfo) : [];
};