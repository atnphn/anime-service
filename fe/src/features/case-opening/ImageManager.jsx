import { useEffect, useState } from "react";
import { getImages, addImages, removeImage } from "./imageStore";
import { getVisitCount } from "./visitStore";
import styles from "./CaseOpening.module.css";

export default function ImageManager({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visitCount, setVisitCount] = useState(null);

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      const count = await getVisitCount();
      if (mounted) setVisitCount(count);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = async () => {
    const rawLines = urlInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (rawLines.length === 0) {
      setError("Nhập ít nhất một URL ảnh trước đã");
      return;
    }

    const validUrls = [];
    const invalidUrls = [];
    for (const line of rawLines) {
      try {
        new URL(line);
        validUrls.push(line);
      } catch (e) {
        invalidUrls.push(line);
      }
    }

    if (validUrls.length === 0) {
      setError("Không có URL hợp lệ nào cả");
      return;
    }

    setSaving(true);
    const updated = await addImages(validUrls);
    setImages(updated);
    setUrlInput("");
    setSaving(false);
    onImagesChange?.(updated);

    if (invalidUrls.length > 0) {
      setError(`Đã thêm ${validUrls.length} ảnh, bỏ qua ${invalidUrls.length} URL không hợp lệ`);
    } else {
      setError("");
    }
  };

  const handleRemove = async (id) => {
    const updated = await removeImage(id);
    setImages(updated);
    onImagesChange?.(updated);
  };

  return (
    <div className={styles.manager}>
      <h2 className={styles.managerTitle}>Tủ ảnh xinh xắn</h2>
      <p className={styles.emptyHistory} style={{ marginBottom: 14 }}>
        {visitCount === null ? "Đang tải lượt truy cập..." : `Lượt truy cập trang: ${visitCount}`}
      </p>

      <div className={styles.managerInputRow}>
        <textarea
          placeholder="Dán nhiều URL ảnh vào đây, mỗi URL một dòng (hoặc cách nhau bằng dấu phẩy) nha..."
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            if (error) setError("");
          }}
          className={styles.managerInput}
          rows={4}
        />
      </div>
      <div className={styles.managerInputRow}>
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
