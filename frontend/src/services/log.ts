import axios from "axios";
import API from "@/lib/api";

export async function AskLogFile(log_filename: string, question: string) {
  const response = await API.post("/log/ask", { log_filename, question });
  return response.data;
}

export async function uploadLogFile(form_data: FormData) {
  const response = await axios.post("http://localhost:8000/log/upload", form_data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
