const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getVisitCount() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/visits/count`);
    if (!res.ok) throw new Error("Lấy lượt truy cập thất bại");
    const data = await res.json();
    return data.count;
  } catch (e) {
    return null;
  }
}

export async function incrementVisit() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/visits/increment`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Tăng lượt truy cập thất bại");
    const data = await res.json();
    return data.count;
  } catch (e) {
    return null;
  }
}
