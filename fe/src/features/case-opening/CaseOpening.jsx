import { useEffect, useRef, useState } from "react";
import { useCaseOpening } from "./useCaseOpening";
import ImageManager from "./ImageManager";
import styles from "./CaseOpening.module.css";

export default function CaseOpening() {
  const {
    reelImages,
    winnerIndex,
    winnerRarity,
    status,
    isSpinning,
    pendingResult,
    confirmedResult,
    history,
    openCase,
    confirmResult,
    retry,
    loadPreview,
  } = useCaseOpening();

  const [showManager, setShowManager] = useState(false);
  const [showCodeGate, setShowCodeGate] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const reelRef = useRef(null);
  const wrapRef = useRef(null);
  const openSoundRef = useRef(null);
  const revealSoundRef = useRef(null);
  const prevPendingRef = useRef(null);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  useEffect(() => {
    if (!reelRef.current || !wrapRef.current) return;
    const reel = reelRef.current;

    if (winnerIndex < 0) {
      reel.style.transition = "none";
      reel.style.transform = "translateX(0px)";
      return;
    }

    reel.style.transition = "none";
    reel.style.transform = "translateX(0px)";

    requestAnimationFrame(() => {
      const cardWidth = 150 + 12;
      const wrapWidth = wrapRef.current.clientWidth;
      const targetOffset =
        winnerIndex * cardWidth + 150 / 2 - wrapWidth / 2 + (Math.random() * 40 - 20);
      reel.style.transition = "transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)";
      reel.style.transform = `translateX(-${targetOffset}px)`;
    });
  }, [winnerIndex, reelImages]);

  useEffect(() => {
    if (pendingResult && pendingResult !== prevPendingRef.current) {
      prevPendingRef.current = pendingResult;
      if (openSoundRef.current) {
        openSoundRef.current.pause();
        openSoundRef.current.currentTime = 0;
      }
      if (revealSoundRef.current) {
        revealSoundRef.current.currentTime = 0;
        revealSoundRef.current.play().catch(() => {});
      }
    }
  }, [pendingResult]);

  const handleOpen = () => {
    if (openSoundRef.current) {
      openSoundRef.current.currentTime = 0;
      openSoundRef.current.play().catch(() => {});
    }
    openCase();
  };

  const handleRetry = () => {
    if (openSoundRef.current) {
      openSoundRef.current.pause();
      openSoundRef.current.currentTime = 0;
    }
    retry();
  };

  const handleManagerToggleClick = () => {
    if (showManager) {
      // đang mở thì đóng luôn, không cần nhập lại mã
      setShowManager(false);
      return;
    }
    setCodeInput("");
    setCodeError("");
    setShowCodeGate(true);
  };

  const [checkingCode, setCheckingCode] = useState(false);

  const handleCodeSubmit = async () => {
    if (!codeInput.trim()) {
      setCodeError("Nhập mã trước đã");
      return;
    }
    setCheckingCode(true);
    setCodeError("");
    try {
      const res = await fetch("http://localhost:8080/api/manager/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });
      const data = await res.json();
      if (data.valid) {
        setShowManager(true);
        setShowCodeGate(false);
        setCodeInput("");
        setCodeError("");
      } else {
        setCodeError("Sai mã rồi, thử lại nhé");
      }
    } catch (e) {
      setCodeError("Không kết nối được server, thử lại sau");
    } finally {
      setCheckingCode(false);
    }
  };

  const handleCodeKeyDown = (e) => {
    if (e.key === "Enter") handleCodeSubmit();
  };

  const handleCodeCancel = () => {
    setShowCodeGate(false);
    setCodeInput("");
    setCodeError("");
  };

  if (confirmedResult) {
    return (
      <div className={styles.page}>
        <div className={styles.confirmedView}>
          <img src={confirmedResult.url} alt="Ảnh đã chọn" className={styles.confirmedImg} />
          <p className={styles.confirmedText}>Quà của onichan đây nè!</p>
          <button className={styles.openBtn} onClick={handleRetry}>
            Mở hòm khác nhé
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <audio ref={openSoundRef} src="/sounds/open.mp3" preload="auto" />
      <audio ref={revealSoundRef} src="/sounds/reveal.mp3" preload="auto" />

      <div className={styles.topBar}>
        <button className={styles.managerToggle} onClick={handleManagerToggleClick}>
          {showManager ? "Đóng rương bí mật" : "Mở rương bí mật"}
        </button>
      </div>

      {showManager && <ImageManager onImagesChange={() => loadPreview()} />}

      <h1 className={styles.title}>Hòm quà anime</h1>
      <p className={styles.subtitle}>Bấm một cái, nhận một bé xinh nha ✨</p>

      <div className={styles.reelWrap} ref={wrapRef}>
        <div className={styles.marker} />
        <div className={styles.reel} ref={reelRef}>
          {reelImages.map((url, i) => {
            const isWinner = i === winnerIndex;
            const rarityKey = isWinner && winnerRarity ? winnerRarity.key : "common";
            return (
              <div key={i} className={`${styles.card} ${styles[rarityKey]}`}>
                <img src={url} alt="" loading="lazy" />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.openBtn} onClick={handleOpen} disabled={isSpinning}>
          Mở hòm nè!
        </button>
        <div className={styles.status}>{status}</div>
      </div>

      <div className={styles.history}>
        <h2 className={styles.historyTitle}>Những bé đã gặp trong phiên này</h2>
        <div className={styles.historyGrid}>
          {history.length === 0 ? (
            <span className={styles.emptyHistory}>Chưa có bé nào ghé chơi nè.</span>
          ) : (
            history.map((item, i) => (
              <div key={i} className={`${styles.thumb} ${styles[item.rarity.key]}`}>
                <img src={item.url} alt="" />
              </div>
            ))
          )}
        </div>
      </div>

      {pendingResult && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <img src={pendingResult.url} alt="Bé anime nhận được" className={styles.modalImg} />
            <span className={`${styles.rarityTag} ${styles[pendingResult.rarity.key]}`}>
              {pendingResult.rarity.label}
            </span>
            <div className={styles.modalActions}>
              <button className={styles.selectBtn} onClick={confirmResult}>
                Nhận bé này
              </button>
              <button className={styles.retryBtn} onClick={handleRetry}>
                Quay lại nhé
              </button>
            </div>
          </div>
        </div>
      )}

      {showCodeGate && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <p className={styles.confirmedText} style={{ fontSize: 16, margin: "0 0 16px" }}>
              Nhập mã để mở rương bí mật
            </p>
            <input
              type="password"
              className={styles.managerInput}
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value);
                if (codeError) setCodeError("");
              }}
              onKeyDown={handleCodeKeyDown}
              placeholder="Mã..."
              autoFocus
            />
            {codeError && <div className={styles.managerError}>{codeError}</div>}
            <div className={styles.modalActions}>
              <button className={styles.selectBtn} onClick={handleCodeSubmit} disabled={checkingCode}>
                {checkingCode ? "Đang kiểm tra..." : "Xác nhận"}
              </button>
              <button className={styles.retryBtn} onClick={handleCodeCancel}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
