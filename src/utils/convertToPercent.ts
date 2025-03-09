const MAX_CAPA = 320;
const MIN_CAPA = 90;


export default function convertToPercent(capacity: number) {
    const raw_value = (100 - ((capacity - MIN_CAPA) / (MAX_CAPA - MIN_CAPA)) * 100);
    return Math.max(0, Math.min(100, raw_value));
} 