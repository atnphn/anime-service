import { useEffect, useState } from "react";
import { getImages, addImage, removeImage } from "./imageStore";
import styles from "./CaseOpening.module.css";

export default function ImageManager({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getImages();
      if (mounted) {
        setImages(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("Nhập một URL ảnh trước đã");
      return;
    }
    try {
      new URL(trimmed);
    } catch (e) {
      setError("URL không hợp lệ");
      return;
    }
    setSaving(true);
    const updated = await addImage(trimmed);
    setImages(updated);
    setUrlInput("");
    setError("");
    setSaving(false);
    onImagesChange?.(updated);
  };

  const handleRemove = async (id) => {
    const updated = await removeImage(id);
    setImages(updated);
    onImagesChange?.(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className={styles.manager}>
      <h2 className={styles.managerTitle}>Tủ ảnh xinh xắn</h2>

      <div className={styles.managerInputRow}>
        <input
          type="text"
          placeholder="Dán URL ảnh vào đây nha..."
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          className={styles.managerInput}
        />
        <button className={styles.managerAddBtn} onClick={handleAdd} disabled={saving}>
          {saving ? "Đang lưu..." : "Cất ảnh"}
        </button>
      </div>
      {error && <div className={styles.managerError}>{error}</div>}

      <div className={styles.managerGrid}>
        {loading ? (
          <span className={styles.emptyHistory}>Đang tải...</span>
        ) : images.length === 0 ? (
          <span className={styles.emptyHistory}>Chưa có ảnh nào, hãy thêm ít nhất một ảnh.</span>
        ) : (
          images.map((img) => (
            <div key={img.id} className={styles.managerItem}>
              <img src={img.url} alt="" />
              <button
                className={styles.managerRemoveBtn}
                onClick={() => handleRemove(img.id)}
                aria-label="Xóa ảnh"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
