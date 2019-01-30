export const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;

export const hexToRGB = (hex, format) => {
  if (!hexRegex.test(hex)) {
    return null;
  }

  let hexColor = hex.substring(1).split('');

  if (hexColor.length === 3) {
    hexColor = [hexColor[0], hexColor[0], hexColor[1], hexColor[1], hexColor[2], hexColor[2]];
  }

  const returnFormat = format ? format.toLowerCase() : null;

  const r = parseInt(`${hexColor[0]}${hexColor[1]}`, 16);
  const g = parseInt(`${hexColor[2]}${hexColor[3]}`, 16);
  const b = parseInt(`${hexColor[4]}${hexColor[5]}`, 16);

  if (returnFormat === 'object') {
    return { r, g, b };
  }

  return `rgb(${r.toString(10)}, ${g.toString(10)}, ${b.toString(10)})`;
};

export default {
  hexRegex,
  hexToRGB,
};
