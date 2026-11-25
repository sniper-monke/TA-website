const duration = 2.6;
const stagger = 0.52;
const unfoldStart = 0.53;
const unfoldDuration = 1.24;
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

function drawPulse(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const travel = 1 - (1 - clamp(time / 1.55)) ** 2;
  const front = width * mix(1.26, 0.04, travel);
  const reach = width * 0.32;
  const strength = 1 - smooth(clamp((time - 0.6) / 0.95));
  const from = Math.max(0, front - reach);
  const to = Math.min(width, front + reach);
  if (from >= to || strength === 0) return;

  const ink = ctx.createLinearGradient(front - reach, 0, front + reach, 0);
  ink.addColorStop(0, "#bf673b00");
  ink.addColorStop(0.5, "#a8542eae");
  ink.addColorStop(1, "#bf673b00");
  ctx.strokeStyle = ink;
  ctx.lineCap = "round";

  const amplitude = Math.min(height * 0.16, 46);
  for (let line = 0; line < 3; line++) {
    ctx.globalAlpha = strength * (0.9 - line * 0.19);
    ctx.lineWidth = line === 0 ? 1.6 : 0.95;
    ctx.beginPath();
    for (let x = from; x <= to; x += 5) {
      const distance = (x - front) / reach;
      const envelope = Math.exp(-3.5 * distance * distance);
      const y = height * 0.51 + Math.sin(distance * 7.75 + line * 0.54) * amplitude * envelope;
      if (x === from) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** Paint the travelling wave, joining aligned slats back into a single image as they settle. */
export function playTimberWave(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  onFinish: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const slices = timberSlices(image);
  if (slices.length === 0) return null;

  const last = Math.max(1, slices.length - 1);
  const delay = stagger / last;
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
    if (width === 0 || height === 0) {
      onFinish();
      return;
    }

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2,
      Math.sqrt(1400000 / (width * height)),
    );
    const pixelWidth = Math.max(1, Math.round(width * pixelRatio));
    const pixelHeight = Math.max(1, Math.round(height * pixelRatio));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const scale = Math.min(width / imageWidth, height / imageHeight);
    const left = (width - imageWidth * scale) / 2;
    const top = (height - imageHeight * scale) / 2;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    drawPulse(ctx, width, height, time);

    const joined = Math.max(
      0,
      Math.min(slices.length, Math.floor((time - unfoldStart - unfoldDuration) / delay) + 1),
    );
    const edge = slices[joined - 1];
    if (edge) {
      const joinedWidth = joined === slices.length ? imageWidth : edge.x + edge.width;
      ctx.drawImage(
        image,
        0,
        0,
        joinedWidth,
        imageHeight,
        left,
        top,
        joinedWidth * scale,
        imageHeight * scale,
      );
    }

    const amplitude = Math.min(height * 0.15, width * 0.065);
    for (let index = joined; index < slices.length; index++) {
      const slat = slices[index];
      if (!slat) continue;
      const position = index / last;
      const localTime = time - index * delay;
      const travel = 1 - (1 - clamp(localTime / 1.1)) ** 3;
      const unfold = smooth(clamp((localTime - unfoldStart) / unfoldDuration));
      const phase = position * 9.8 + time * 7.2;
      const pulse = Math.sin(phase) * (0.54 + 0.46 * Math.sin(position * Math.PI));
      const finalX = left + (slat.x + slat.width / 2) * scale;
      const finalY = top + (slat.y + slat.height / 2) * scale;
      const packedX = width * 0.51 + (finalX - width * 0.51) * 0.64;
      const x = mix(packedX, finalX, unfold) + (1 - travel) * width * 1.12;
      const y = mix(height * 0.51 + pulse * amplitude, finalY, unfold);
      const slatWidth = slat.width * scale * mix(0.37, 1, unfold);
      const slatHeight = mix(
        amplitude * (0.38 + Math.abs(pulse) * 1.58),
        slat.height * scale,
        unfold,
      );
      const angle = (1 - unfold) * (Math.cos(phase) * 0.48 - 0.19);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
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
    frame = requestAnimationFrame(paint);
  };

  frame = requestAnimationFrame(paint);
  return () => cancelAnimationFrame(frame);
}
