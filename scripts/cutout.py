"""Recorta o personagem do Isaac da ilustração original (remove o cenário).

Uso (num venv com `pip install "rembg[cpu]"`):
    python scripts/cutout.py <imagem-original> <pasta-de-saída> [modelo]

Gera `mask-<modelo>.png` (máscara crua) e `cutout-<modelo>.png` (RGBA), já
recortados na região da pessoa, e as duas imagens usadas no site: `isaac.png`
(hero, cortada acima da mesa) e `mascote.png` (busto 384×384). Copie essas duas
para `src/assets/hero/`.

Memória: a máquina tem 7 GB e o `birefnet-general-lite` passou de 9 GB de
memória virtual, até ser morto pelo OOM killer (e levou o terminal junto). Por
isso o padrão é o `isnet-general-use`, bem mais leve (o `isnet-anime` também
roda, mas mantém monitores e balões junto da pessoa). A sessão do ONNX roda com 2 threads e sem o arena de memória, e a entrada é
reduzida para o tamanho que o modelo usa (1024 px) antes da inferência. Rode
sempre dentro de um teto de memória, por exemplo:

    systemd-run --user --scope -p MemoryMax=1800M -p MemorySwapMax=256M \\
        venv/bin/python scripts/cutout.py ...
"""
import os
import sys
from pathlib import Path

os.environ.setdefault("OMP_NUM_THREADS", "2")

import onnxruntime as ort  # noqa: E402
from PIL import Image  # noqa: E402
from rembg import new_session, remove  # noqa: E402

# Região da pessoa na ilustração 1536x2752 (cabeça → logo acima do teclado),
# com folga nas laterais para os ombros e o capuz.
CROP = (120, 540, 1460, 2080)
# Lado maior da imagem entregue ao modelo; a máscara volta ao tamanho do recorte.
INFER = 1024

src, out = Path(sys.argv[1]), Path(sys.argv[2])
model = sys.argv[3] if len(sys.argv) > 3 else "isnet-general-use"
out.mkdir(parents=True, exist_ok=True)

opts = ort.SessionOptions()
opts.intra_op_num_threads = int(os.environ["OMP_NUM_THREADS"])
opts.inter_op_num_threads = 1
opts.enable_cpu_mem_arena = False
opts.enable_mem_pattern = False
opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL

img = Image.open(src).convert("RGB").crop(CROP)
small = img.copy()
small.thumbnail((INFER, INFER), Image.Resampling.LANCZOS)

session = new_session(model, sess_opts=opts)
mask = remove(small, session=session, only_mask=True, post_process_mask=True)
del session
mask = mask.resize(img.size, Image.Resampling.LANCZOS)
mask.save(out / f"mask-{model}.png")

rgba = img.copy()
rgba.putalpha(mask.point(lambda a: 0 if a < 12 else a))  # zera o ruído fraco da máscara
rgba.save(out / f"cutout-{model}.png")

# Recortes do site (coordenadas dentro de CROP): o hero para logo acima da mesa;
# o busto do mascote pega cabeça e ombros.
rgba.crop((70, 90, 1295, 1400)).save(out / "isaac.png", optimize=True)
rgba.crop((300, 90, 1040, 830)).resize((384, 384), Image.Resampling.LANCZOS).save(out / "mascote.png", optimize=True)
print("ok", model, img.size)
