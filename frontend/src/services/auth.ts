import API from "@/lib/api";

export async function register(email: string, password: string) {
  const response = await API.post("/auth/register", { email, password });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await API.post("/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token)
  return response.data;
}

export async function getMe() {
  const response = await API.get("/users/me");
  return response.data;
}

export async function logout(refresh_token: string) {
  console.log("Logging out with refresh token:", refresh_token);
  const response = await API.post("/auth/logout", {refresh_token});
  return response.data;
}