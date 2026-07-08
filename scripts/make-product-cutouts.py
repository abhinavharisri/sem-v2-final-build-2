#!/usr/bin/env python3
from __future__ import annotations

import binascii
import collections
import math
import re
import sys
import struct
import subprocess
import tempfile
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "images" / "products"
OUT_DIR = SRC_DIR / "transparent"
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}


def paeth(a: int, b: int, c: int) -> int:
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def png_chunk(kind: bytes, data: bytes) -> bytes:
    crc = binascii.crc32(kind + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", crc)


def read_png(path: Path) -> tuple[int, int, list[bytearray]]:
    data = path.read_bytes()
    if not data.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError(f"{path} is not a PNG")

    pos = 8
    chunks: list[tuple[bytes, bytes]] = []
    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        kind = data[pos + 4 : pos + 8]
        payload = data[pos + 8 : pos + 8 + length]
        chunks.append((kind, payload))
        pos += length + 12
        if kind == b"IEND":
            break

    ihdr = next(payload for kind, payload in chunks if kind == b"IHDR")
    width, height, bit_depth, color_type, _compression, _filter, interlace = struct.unpack(
        ">IIBBBBB", ihdr
    )
    if bit_depth != 8 or color_type not in (2, 6) or interlace != 0:
        raise ValueError(f"Unsupported PNG format for {path}: color={color_type}, bit={bit_depth}, interlace={interlace}")

    channels = 4 if color_type == 6 else 3
    bpp = channels
    stride = width * channels
    raw = zlib.decompress(b"".join(payload for kind, payload in chunks if kind == b"IDAT"))
    rows: list[bytearray] = []
    prev = bytearray(stride)
    i = 0

    for _y in range(height):
        filter_type = raw[i]
        i += 1
        scan = bytearray(raw[i : i + stride])
        i += stride
        out = bytearray(stride)
        for x in range(stride):
            left = out[x - bpp] if x >= bpp else 0
            up = prev[x]
            up_left = prev[x - bpp] if x >= bpp else 0
            val = scan[x]
            if filter_type == 0:
                recon = val
            elif filter_type == 1:
                recon = (val + left) & 255
            elif filter_type == 2:
                recon = (val + up) & 255
            elif filter_type == 3:
                recon = (val + ((left + up) // 2)) & 255
            elif filter_type == 4:
                recon = (val + paeth(left, up, up_left)) & 255
            else:
                raise ValueError(f"Unsupported PNG filter {filter_type}")
            out[x] = recon
        if channels == 3:
            rgba = bytearray(width * 4)
            for x in range(width):
                src = x * 3
                dst = x * 4
                rgba[dst : dst + 4] = bytes((out[src], out[src + 1], out[src + 2], 255))
            rows.append(rgba)
            prev = out
        else:
            rows.append(out)
            prev = out
    return width, height, rows


def write_png(path: Path, width: int, height: int, rows: list[bytearray]) -> None:
    raw = bytearray()
    for row in rows:
        raw.append(0)
        raw.extend(row)
    data = b"\x89PNG\r\n\x1a\n"
    data += png_chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    data += png_chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    data += png_chunk(b"IEND", b"")
    path.write_bytes(data)


def convert_to_png(src: Path, tmp: Path) -> None:
    subprocess.run(
        ["sips", "-Z", "900", "-s", "format", "png", str(src), "--out", str(tmp)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def pixel(rows: list[bytearray], width: int, x: int, y: int) -> tuple[int, int, int, int]:
    o = x * 4
    row = rows[y]
    return row[o], row[o + 1], row[o + 2], row[o + 3]


def color_distance(a: tuple[float, float, float], b: tuple[int, int, int]) -> float:
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)


def estimate_background(width: int, height: int, rows: list[bytearray]) -> tuple[float, float, float]:
    samples: list[tuple[int, int, int]] = []
    for x in range(width):
        for y in (0, height - 1):
            r, g, b, a = pixel(rows, width, x, y)
            if a and max(r, g, b) > 175:
                samples.append((r, g, b))
    for y in range(height):
        for x in (0, width - 1):
            r, g, b, a = pixel(rows, width, x, y)
            if a and max(r, g, b) > 175:
                samples.append((r, g, b))
    if not samples:
        samples = [pixel(rows, width, 0, 0)[:3], pixel(rows, width, width - 1, 0)[:3]]
    return (
        sum(p[0] for p in samples) / len(samples),
        sum(p[1] for p in samples) / len(samples),
        sum(p[2] for p in samples) / len(samples),
    )


def is_light_neutral(r: int, g: int, b: int) -> bool:
    bright = max(r, g, b)
    spread = max(r, g, b) - min(r, g, b)
    return bright >= 226 and spread <= 38


def make_cutout(src: Path, out: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_png = Path(tmp_dir) / "source.png"
        convert_to_png(src, tmp_png)
        width, height, rows = read_png(tmp_png)

    bg = estimate_background(width, height, rows)
    mask = bytearray(width * height)

    def bg_like(x: int, y: int) -> bool:
        r, g, b, a = pixel(rows, width, x, y)
        if a == 0:
            return True
        return color_distance(bg, (r, g, b)) <= 58 or is_light_neutral(r, g, b)

    q: collections.deque[tuple[int, int]] = collections.deque()
    for x in range(width):
        for y in (0, height - 1):
            if bg_like(x, y):
                mask[y * width + x] = 1
                q.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if not mask[y * width + x] and bg_like(x, y):
                mask[y * width + x] = 1
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            idx = ny * width + nx
            if mask[idx] or not bg_like(nx, ny):
                continue
            mask[idx] = 1
            q.append((nx, ny))

    for y, row in enumerate(rows):
        for x in range(width):
            idx = y * width + x
            o = x * 4
            r, g, b, a = row[o : o + 4]
            if mask[idx]:
                row[o + 3] = 0

    # Remove detached source labels or dust specks, especially black labels near the top.
    seen = bytearray(width * height)
    components: list[tuple[int, int, int, int, int, list[tuple[int, int]]]] = []
    for sy in range(height):
        for sx in range(width):
            start = sy * width + sx
            if seen[start] or rows[sy][sx * 4 + 3] <= 8:
                continue
            q = collections.deque([(sx, sy)])
            seen[start] = 1
            pts: list[tuple[int, int]] = []
            minx = maxx = sx
            miny = maxy = sy
            while q:
                x, y = q.popleft()
                pts.append((x, y))
                minx = min(minx, x)
                maxx = max(maxx, x)
                miny = min(miny, y)
                maxy = max(maxy, y)
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    idx = ny * width + nx
                    if seen[idx] or rows[ny][nx * 4 + 3] <= 8:
                        continue
                    seen[idx] = 1
                    q.append((nx, ny))
            components.append((len(pts), minx, miny, maxx, maxy, pts))

    if components:
        max_area = max(c[0] for c in components)
        for area, _minx, miny, _maxx, maxy, pts in components:
            top_detached_label = maxy < height * 0.24 and area < max_area * 0.22
            tiny_speck = area < max(60, max_area * 0.0025)
            if top_detached_label or tiny_speck:
                for x, y in pts:
                    rows[y][x * 4 + 3] = 0

    xs: list[int] = []
    ys: list[int] = []
    for y, row in enumerate(rows):
        for x in range(width):
            if row[x * 4 + 3] > 8:
                xs.append(x)
                ys.append(y)
    if not xs:
        return

    pad = 12
    left = max(min(xs) - pad, 0)
    top = max(min(ys) - pad, 0)
    right = min(max(xs) + pad + 1, width)
    bottom = min(max(ys) + pad + 1, height)
    cropped = [bytearray(row[left * 4 : right * 4]) for row in rows[top:bottom]]
    write_png(out, right - left, bottom - top, cropped)


def product_card_sources() -> list[Path]:
    data = (ROOT / "js" / "products.js").read_text()
    sources: list[Path] = []
    for match in re.finditer(r"images:\s*\[\s*\"([^\"]+)\"", data):
        rel = match.group(1).lstrip("/")
        path = ROOT / rel
        if path.exists() and path.parent == SRC_DIR:
            sources.append(path)
    return sorted(set(sources))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if "--card-images" in sys.argv:
        sources = product_card_sources()
    else:
        sources = sorted(p for p in SRC_DIR.iterdir() if p.is_file() and p.suffix.lower() in SUPPORTED)
    for index, src in enumerate(sources, 1):
        out = OUT_DIR / f"{src.stem}.png"
        make_cutout(src, out)
        print(f"[{index:03d}/{len(sources):03d}] {src.name} -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
