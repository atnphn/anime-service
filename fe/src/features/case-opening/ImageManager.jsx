import { useState } from "react";
import { getImages, addImage, removeImage } from "./imageStore";
import styles from "./CaseOpening.module.css";

export default function ImageManager({ onImagesChange }) {
  const [images, setImages] = useState(() => getImages());
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("Nhập URL ảnh vào đây trước nha");
      return;
    }
    try {
      new URL(trimmed);
    } catch (e) {
      setError("Ưm... URL này chưa đúng rồi nè");
      return;
    }
    const updated = addImage(trimmed);
    setImages(updated);
    setUrlInput("");
    setError("");
    onImagesChange?.(updated);
  };

  const handleRemove = (url) => {
    const updated = removeImage(url);
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
        <button className={styles.managerAddBtn} onClick={handleAdd}>
          Cất ảnh
        </button>
      </div>
      {error && <div className={styles.managerError}>{error}</div>}

      <div className={styles.managerGrid}>
        {images.length === 0 ? (
          <span className={styles.emptyHistory}>Tủ đang trống, thêm vài bé vào nhé.</span>
        ) : (
          images.map((url) => (
            <div key={url} className={styles.managerItem}>
              <img src={url} alt="" />
              <button
                className={styles.managerRemoveBtn}
                onClick={() => handleRemove(url)}
                aria-label="Cất ảnh này đi"
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
