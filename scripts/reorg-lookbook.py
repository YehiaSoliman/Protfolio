from pathlib import Path

root = Path(__file__).resolve().parent.parent / "public" / "lookbook"

sections = {
    "Awards & certificates": list(range(32, 36)),
    "Press": list(range(3, 6)),
    "Training & Workshops": [7, *range(9, 15)],
    "Student work": list(range(16, 22)),
    "Exhibition": list(range(23, 31)),
    "Costume design": list(range(37, 62)),
    "Published researches": list(range(63, 68)),
}

moved = []
for name, nums in sections.items():
    dest = root / name
    dest.mkdir(parents=True, exist_ok=True)
    for n in nums:
        src = root / f"p{n:02d}.png"
        if src.exists():
            src.rename(dest / src.name)
            moved.append(src.name)

unused = root / "_unused"
unused.mkdir(exist_ok=True)
leftover = [p for p in root.iterdir() if p.is_file()]
for p in leftover:
    p.rename(unused / p.name)

print("folders:")
for p in sorted(root.iterdir(), key=lambda x: x.name.lower()):
    if p.is_dir():
        files = sorted(f.name for f in p.iterdir() if f.is_file())
        print(f"  {p.name}/ ({len(files)})")
        for f in files:
            print(f"    {f}")
