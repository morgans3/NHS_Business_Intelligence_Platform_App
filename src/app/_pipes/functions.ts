import jwt_decode from "jwt-decode";

export const generateID = () => {
    return new Date().toISOString().split("-").join().split(":").join().split(".").join().replace("T", "").replace("Z", "");
};

export const decodeToken = (token: any) => {
    return jwt_decode(token);
};

export const ucfirst = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};
