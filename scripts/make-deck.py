"""Write an Anki-importable TSV deck from a Python list of (front, back, tags).

Usage: python scripts/make-deck.py <cards.py> <out.tsv>
<cards.py> defines CARDS = [("front", "back", "tags"), ...]. HTML is allowed; use <br> for line breaks.
"""
import runpy, sys

cards = runpy.run_path(sys.argv[1])["CARDS"]
with open(sys.argv[2], "w", encoding="utf-8", newline="\n") as f:
    f.write("#separator:tab\n#html:true\n#tags column:3\n")
    for front, back, tags in cards:
        for field in (front, back, tags):
            if "\t" in field or "\n" in field:
                raise SystemExit(f"tab or newline inside a field: {field[:40]!r}")
        f.write(f"{front}\t{back}\t{tags}\n")
print(f"{sys.argv[2]}: {len(cards)} cards")
