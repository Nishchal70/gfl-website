#!/usr/bin/env bash
# Task 14 verification: Creator/Admin role permission matrix via live API
set -u
BASE="http://localhost:3000"
CJ=/tmp/gfl-verify-cookies.txt
rm -f "$CJ"

pass=0; fail=0
check() { # $1 desc, $2 actual, $3 expected-substring
  if echo "$2" | grep -q "$3"; then pass=$((pass+1)); echo "PASS: $1";
  else fail=$((fail+1)); echo "FAIL: $1  (got: $2)"; fi
}

echo "=== 1. Creator (Nishchal) login ==="
R=$(curl -s -c "$CJ" -X POST "$BASE/api/staff/login" -H 'Content-Type: application/json' \
  -d '{"email":"nishchal708@gmail.com","password":"discodeewane"}')
check "Nishchal login 200 + role Creator" "$R" '"role":"Creator"'

echo "=== 2. Creator can list/manage staff ==="
R=$(curl -s -b "$CJ" "$BASE/api/staff/manage")
check "Creator GET /manage 200 roster" "$R" '"members":\['
check "Roster contains Nishchal as Creator" "$R" 'nishchal708@gmail.com'

R=$(curl -s -b "$CJ" -o /dev/null -w "%{http_code}" -X POST "$BASE/api/staff/manage" \
  -H 'Content-Type: application/json' -d '{"name":"x","email":"x@y.zz","role":"Admin","password":"password123"}')
check "Creator POST /manage allowed (validation path reachable, not 403)" "$R" "201\|400\|409"

echo "=== 3. Admin (GFL Admin) login ==="
R=$(curl -s -c "$CJ" -X POST "$BASE/api/staff/login" -H 'Content-Type: application/json' \
  -d '{"email":"admin@gfl.gg","password":"GFLstaff2026!"}')
check "Admin login 200 + role Admin" "$R" '"role":"Admin"'

echo "=== 4. Admin blocked from staff management ==="
R=$(curl -s -b "$CJ" -o /dev/null -w "%{http_code}" "$BASE/api/staff/manage")
check "Admin GET /manage -> 403" "$R" "403"
R=$(curl -s -b "$CJ" -o /dev/null -w "%{http_code}" -X POST "$BASE/api/staff/manage" \
  -H 'Content-Type: application/json' -d '{"name":"x","email":"x2@y.zz","role":"Admin","password":"password123"}')
check "Admin POST /manage (register) -> 403" "$R" "403"
R=$(curl -s -b "$CJ" -o /dev/null -w "%{http_code}" -X PATCH "$BASE/api/staff/manage/whatever" \
  -H 'Content-Type: application/json' -d '{"name":"x"}')
check "Admin PATCH /manage/[id] -> 403" "$R" "403"
R=$(curl -s -b "$CJ" -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/staff/manage/whatever")
check "Admin DELETE /manage/[id] -> 403" "$R" "403"

echo "=== 5. Admin CAN edit content (CMS stays open to both) ==="
R=$(curl -s -b "$CJ" -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/admin/content" \
  -H 'Content-Type: application/json' -d '{"page":"nope","data":{}}')
check "Admin PUT /admin/content passes auth (400 validation, not 401/403)" "$R" "400"
R=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE/api/admin/content" \
  -H 'Content-Type: application/json' -d '{"page":"nope","data":{}}')
check "Anonymous PUT /admin/content -> 401" "$R" "401"

echo "=== 6. Own-password route validates (no real password changed) ==="
R=$(curl -s -b "$CJ" -X POST "$BASE/api/staff/password" -H 'Content-Type: application/json' \
  -d '{"currentPassword":"wrong-pass","newPassword":"newpass12345"}')
check "Admin own-password route rejects wrong current pw" "$R" 'current password is incorrect'

echo "=== 7. Last-Creator protections (as Admin -> 403 anyway, check via creator later) ==="
rm -f "$CJ"
echo ""
echo "RESULT: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
