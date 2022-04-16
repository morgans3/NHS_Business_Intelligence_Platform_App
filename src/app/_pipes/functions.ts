import jwt_decode from "jwt-decode";

export const generateID = function () {
  return new Date().toISOString().split("-").join().split(":").join().split(".").join().replace("T", "").replace("Z", "");
};

export const decodeToken = function (token: any) {
  return jwt_decode(token);
};

export const ucfirst = function (string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
