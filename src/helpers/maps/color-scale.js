import { hexRegex, hexToRGB } from './color-functions';

const defaultColors = ['#007bff', '#dc3545'];

export default class ColorScale {
  constructor({ min = 0, max = 100, colors = defaultColors } = {}) {
    this.min = min;
    this.max = max;
    this.colors = colors;
  }

  set colors(colors) {
    this.colorScale = [];

    if (Array.isArray(colors)) {
      const pctInterval = 100 / colors.length;

      colors.forEach((colorValue, colorIndex) => {
        let currentColor = colorValue;

        if (typeof currentColor === 'string') {
          if (hexRegex.test(currentColor)) {
            currentColor = { color: hexToRGB(currentColor, 'object') };
          } else {
            currentColor = { color: currentColor };
          }
        }

        const { color } = currentColor || {};
        let { percent } = currentColor || {};

        if (color) {
          if (!percent) {
            percent = colorIndex * pctInterval;
          }

          if (percent < 1) {
            percent *= 100;
          }

          this.colorScale.push({ percent, color });
        }
      });
    }
  }

  get colors() {
    return this.colorScale;
  }

  getColor(value) {
    if (!value) {
      return null;
    }

    const percent = ((value - this.min) / (this.max - this.min)) * 100;
    let i;

    for (i = 1; i < this.colorScale.length - 1; i += 1) {
      if (percent < this.colorScale[i].percent) {
        break;
      }
    }

    const lower = this.colorScale[i - 1];
    const upper = this.colorScale[i];
    const range = upper.percent - lower.percent;
    const rangePct = (percent - lower.percent) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;

    const color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
    };

    return `rgb(${[color.r, color.g, color.b].join(',')})`;
  }
}
