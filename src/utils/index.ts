export const getContrastColor = (hexColor: string) => {
  hexColor = hexColor.replace("#", "");

  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  return brightness > 128 ? "#000000" : "#FFFFFF";
};

export const hexToRgb = (hex: string) => {
  hex = hex.replace("#", "");

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

export const averageColor = (colors: string[]) => {
  const total = [0, 0, 0];
  colors.forEach((color) => {
    const [r, g, b] = hexToRgb(color);
    total[0] += r;
    total[1] += g;
    total[2] += b;
  });

  const avg = total.map((value) => Math.round(value / colors.length));

  return rgbToHex(avg[0], avg[1], avg[2]);
};
