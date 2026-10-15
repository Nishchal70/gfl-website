"""Set / restore a distinct battle-style intro marker in local SQLite for QA.

Usage:
  python3 scripts/qa-race-marker.py set     -> backup override + write marker
  python3 scripts/qa-race-marker.py restore -> write back the backup
"""
import json
import sqlite3
import sys
from pathlib import Path

DB = Path("/home/z/my-project/db/custom.db")
KEY = "battle-style"
BACKUP = Path("/home/z/my-project/scripts/.qa-battle-style-backup.json")
MARKER_INTRO = "QA RACE TEST MARKER 7362 — if you can read this in the editor, saved overrides load correctly."


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    row = cur.execute(
        "SELECT data FROM SiteContent WHERE key = ?", (KEY,)
    ).fetchone()

    if mode == "set":
        if row is None:
            print("no stored override row for", KEY, "- inserting one from /api/content defaults is not possible here; abort")
            sys.exit(1)
        data = json.loads(row[0])
        BACKUP.write_text(row[0])
        data["intro"] = MARKER_INTRO
        cur.execute(
            "UPDATE SiteContent SET data = ? WHERE key = ?",
            (json.dumps(data), KEY),
        )
        conn.commit()
        print("marker set, original backed up")
    elif mode == "restore":
        if not BACKUP.exists():
            print("no backup file; nothing to restore")
            sys.exit(1)
        cur.execute(
            "UPDATE SiteContent SET data = ? WHERE key = ?",
            (BACKUP.read_text(), KEY),
        )
        conn.commit()
        BACKUP.unlink()
        print("original override restored")
    else:
        print("usage: set | restore")
        sys.exit(1)
    conn.close()


if __name__ == "__main__":
    main()
