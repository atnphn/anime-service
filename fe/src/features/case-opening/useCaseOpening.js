import { useState, useRef, useCallback } from "react";
import { getImages } from "./imageStore";

export const RARITIES = [
  { key: "common", label: "Bé đáng yêu", weight: 60 },
  { key: "rare", label: "Bé lấp lánh", weight: 25 },
  { key: "epic", label: "Bé cực phẩm", weight: 10 },
  { key: "legendary", label: "Bé huyền thoại", weight: 5 },
];

const REEL_LENGTH = 30;
const WINNER_INDEX = 24;
const MAX_HISTORY = 12;
const SPIN_DURATION_MS = 8000;

function pickRarity() {
  const total = RARITIES.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of RARITIES) {
    if (roll < r.weight) return r;
    roll -= r.weight;
  }
  return RARITIES[0];
}

function buildReelFromPool(pool, length) {
  const out = [];
  let lastPicked = null;
  for (let i = 0; i < length; i++) {
    let pick = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1) {
      let attempts = 0;
      while (pick === lastPicked && attempts < 10) {
        pick = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
      }
    }
    out.push(pick);
    lastPicked = pick;
  }
  return out;
}

export function useCaseOpening() {
  const [reelImages, setReelImages] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(-1);
  const [winnerRarity, setWinnerRarity] = useState(null);
  const [status, setStatus] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [pendingResult, setPendingResult] = useState(null); // { url, rarity } - chờ xác nhận
  const [confirmedResult, setConfirmedResult] = useState(null); // { url, rarity } - đã chọn
  const [history, setHistory] = useState([]);
  const spinTimeoutRef = useRef(null);

  const loadPreview = useCallback(async () => {
    const images = await getImages(); // [{ id, url }]
    const urls = images.map((img) => img.url);
    if (urls.length === 0) {
      setReelImages([]);
      setWinnerIndex(-1);
      return;
    }
    setReelImages(buildReelFromPool(urls, 12));
    setWinnerIndex(-1);
  }, []);

  const openCase = useCallback(async () => {
    if (isSpinning) return;

    const images = await getImages();
    const urls = images.map((img) => img.url);
    if (urls.length === 0) {
      setStatus("Hòm đang đói ảnh rồi, thêm vài bé trong Tủ ảnh trước nha!");
      return;
    }

    setIsSpinning(true);
    setPendingResult(null);
    setConfirmedResult(null);
    setStatus("Bé ấy là...");

    const rarity = pickRarity();
    const reel = buildReelFromPool(urls, REEL_LENGTH);
    const winnerUrl = reel[WINNER_INDEX];

    setReelImages(reel);
    setWinnerIndex(WINNER_INDEX);
    setWinnerRarity(rarity);

    spinTimeoutRef.current = setTimeout(() => {
      setStatus("");
      setPendingResult({ url: winnerUrl, rarity });
      setIsSpinning(false);
    }, SPIN_DURATION_MS);
  }, [isSpinning]);

  const confirmResult = useCallback(() => {
    if (!pendingResult) return;
    setConfirmedResult(pendingResult);
    setHistory((prev) => [pendingResult, ...prev].slice(0, MAX_HISTORY));
    setPendingResult(null);
  }, [pendingResult]);

  const retry = useCallback(() => {
    setPendingResult(null);
    setConfirmedResult(null);
    setReelImages([]);
    setWinnerIndex(-1);
    loadPreview();
  }, [loadPreview]);

  return {
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
    SPIN_DURATION_MS,
  };
}
