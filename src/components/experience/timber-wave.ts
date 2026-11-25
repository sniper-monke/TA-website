const duration = 2.85;
const sliceCount = 44;

type Slice = { x: number; y: number; width: number; height: number };

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smooth = (progress: number) => progress * progress * (3 - 2 * progress);

function timberSlices(image: HTMLImageElement): Slice[] {
  // A small alpha scan locates the timber in each slice so it pivots around the
  // visible grain instead of the centre of the entire transparent image.
  const mask = document.createElement("canvas");
  mask.width = 440;
  mask.height = Math.round((mask.width * image.naturalHeight) / image.naturalWidth);
  const context = mask.getContext("2d", { willReadFrequently: true });
  if (!context) return [];
  context.drawImage(image, 0, 0, mask.width, mask.height);
  const { data } = context.getImageData(0, 0, mask.width, mask.height);

  return Array.from({ length: sliceCount }, (_, index) => {
    const start = Math.floor((index * mask.width) / sliceCount);
    const end = Math.floor(((index + 1) * mask.width) / sliceCount);
    let top = mask.height;
    let bottom = 0;
    for (let y = 0; y < mask.height; y++) {
      for (let x = start; x < end; x++) {
        if ((data[(y * mask.width + x) * 4 + 3] ?? 0) < 16) continue;
        top = Math.min(top, y);
        bottom = Math.max(bottom, y + 1);
        break;
      }
    }

    const x = Math.round((start / mask.width) * image.naturalWidth);
    const right = Math.round((end / mask.width) * image.naturalWidth);
    const y = Math.floor((Math.max(0, top - 2) / mask.height) * image.naturalHeight);
    const last = Math.ceil((Math.min(mask.height, bottom + 2) / mask.height) * image.naturalHeight);
    return { x, y, width: right - x, height: Math.max(0, last - y) };
  }).filter(({ height }) => height > 0);
}

function drawPulse(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const front = w * (1.18 - 0.81 * clamp(time / 1.55));
  const strength = clamp(time / 0.24) * (1 - smooth(clamp((time - 0.58) / 1.25)));
  const amplitude = Math.min(h * 0.16, 42) * strength;

  ctx.strokeStyle = "#bf673b";
  for (let line = 0; line < 3; line++) {
    ctx.globalAlpha = strength * (0.46 - line * 0.1);
    ctx.lineWidth = line === 0 ? 1.45 : 0.85;
    ctx.beginPath();
    for (let x = 0; x <= w + 7; x += 7) {
      const distance = (x - front) / w;
      const envelope = Math.exp(-32 * distance * distance);
      const y = h * 0.52 + Math.sin(distance * 32 + line * 0.55) * amplitude * envelope;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** Paint independent sections of the original artwork until they align exactly with the source. */
export function playTimberWave(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  onFinish: () => void,
) {
  const ctx = canvas.getContext("2d");
  const slices = timberSlices(image);
  if (!ctx || slices.length === 0) return null;

  let frame = 0;
  let start: number | undefined;

  const paint = (now: number) => {
    start ??= now;
    const time = (now - start) / 1000;
    if (time >= duration) {
      onFinish();
      return;
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.round(width * pixelRatio));
    const pixelHeight = Math.max(1, Math.round(height * pixelRatio));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const left = (width - image.naturalWidth * scale) / 2;
    const top = (height - image.naturalHeight * scale) / 2;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    if (scale > 0 && time >= 2.56) {
      ctx.drawImage(image, left, top, image.naturalWidth * scale, image.naturalHeight * scale);
    } else if (scale > 0) {
      drawPulse(ctx, width, height, time);
      for (const [index, slat] of slices.entries()) {
        const position = index / Math.max(1, slices.length - 1);
        const delay = position * 0.5;
        const travel = 1 - (1 - clamp((time - delay) / 1.3)) ** 3;
        const assembly = smooth(clamp((time - 0.62 - delay) / 1.37));
        const loose = 1 - assembly;
        const phase = position * 13 - time * 7.5;
        const finalX = left + (slat.x + slat.width / 2) * scale;
        const finalY = top + (slat.y + slat.height / 2) * scale;
        const packedX = width * 0.5 + (finalX - width * 0.5) * 0.65;
        const packedY = height * 0.51 + Math.sin(phase) * height * 0.115;
        const x = mix(packedX, finalX, assembly) + (1 - travel) * width * 1.12;
        const y = mix(packedY, finalY, assembly);
        const slatWidth = slat.width * scale * mix(0.43, 1, assembly);
        const slatHeight =
          slat.height * scale * mix(0.14 + Math.abs(Math.sin(phase)) * 0.27, 1, assembly);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(loose * (Math.sin(phase) * 0.48 - 0.2));
        ctx.drawImage(
          image,
          slat.x,
          slat.y,
          slat.width,
          slat.height,
          -slatWidth / 2,
          -slatHeight / 2,
          slatWidth,
          slatHeight,
        );
        ctx.restore();
      }
    }
    frame = requestAnimationFrame(paint);
  };

  frame = requestAnimationFrame(paint);
  return () => cancelAnimationFrame(frame);
}
