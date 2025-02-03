// ローカル現在時刻の取得
export const formatDate = (dateString) => {
    const date = new Date(dateString);

    // UTC の場合のみ JST に変換
    const offset = date.getTimezoneOffset(); // UTCなら -540 (日本標準時のオフセット)
    if (offset === 0) {
        date.setHours(date.getHours() + 9);
    }

    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};