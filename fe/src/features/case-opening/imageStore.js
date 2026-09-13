const STORAGE_KEY = "case_opening_images";

const DEFAULT_IMAGES = [
  "https://picsum.photos/seed/anime1/400/500",
  "https://picsum.photos/seed/anime2/400/500",
  "https://picsum.photos/seed/anime3/400/500",
];

export function getImages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_IMAGES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_IMAGES;
  } catch (e) {
    return DEFAULT_IMAGES;
  }
}

export function saveImages(images) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (e) {
    // ignore lỗi storage đầy hoặc bị chặn
  }
}

export function addImage(url) {
  const trimmed = url.trim();
  if (!trimmed) return getImages();
  const current = getImages();
  if (current.includes(trimmed)) return current;
  const updated = [...current, trimmed];
  saveImages(updated);
  return updated;
}

export function removeImage(url) {
  const updated = getImages().filter((img) => img !== url);
  saveImages(updated.length > 0 ? updated : []);
  return updated;
}
