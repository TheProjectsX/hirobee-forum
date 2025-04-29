export const toNumber = (value, fallback = null) => {
    try {
        const num = Number(value);
        if (!isNaN(num) && isFinite(num)) return num;
        else return fallback;
    } catch (error) {
        return fallback;
    }
};
