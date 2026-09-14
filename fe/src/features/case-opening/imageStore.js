const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Trả về danh sách ảnh dạng [{ id, url }, ...] lấy từ server
export async function getImages() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/images`);
    if (!res.ok) throw new Error("Lấy danh sách ảnh thất bại");
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function addImage(url) {
  const trimmed = url.trim();
  if (!trimmed) return getImages();
  try {
    const res = await fetch(`${API_BASE_URL}/api/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: trimmed }),
    });
    if (!res.ok) throw new Error("Thêm ảnh thất bại");
  } catch (e) {
    // bỏ qua, danh sách trả về vẫn phản ánh trạng thái hiện có trên server
  }
  return getImages();
}

export async function removeImage(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/images/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Xóa ảnh thất bại");
  } catch (e) {
    // bỏ qua
  }
  return getImages();
}
