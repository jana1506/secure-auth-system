Here's your complete testing script:

---

## TESTING SCRIPT - Secure Authentication System

### Step 1: Start the server
```
node server.js
```

---

### Step 2: Register users (run in a second PowerShell window)

**Navigate to project folder:**
```
cd C:\college\data-intg\secure-auth-system
```

**Register Admin:**
```
$body = @{name="AdminUser"; email="admintest@test.com"; password="admin123"; role="admin"} | ConvertTo-Json; $response = Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method Post -Body $body -ContentType "application/json"; $response.message; $response.qrCode
```

**Register Manager:**
```
$body = @{name="ManagerUser"; email="mgrtest@test.com"; password="mgr123"; role="manager"} | ConvertTo-Json; $response = Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method Post -Body $body -ContentType "application/json"; $response.message; $response.qrCode
```

**Register User:**
```
$body = @{name="NormalUser"; email="usertest@test.com"; password="user123"; role="user"} | ConvertTo-Json; $response = Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method Post -Body $body -ContentType "application/json"; $response.message; $response.qrCode
```

---

### Step 3: Scan QR codes
For each registration, copy the long string (starts with `data:image/png;base64,...`), paste in browser address bar, press Enter, and scan with Google Authenticator.

---

### Step 4: Login with password (get temp token)

**Login as Admin:**
```
$body = @{email="admintest@test.com"; password="admin123"} | ConvertTo-Json; $loginResponse = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method Post -Body $body -ContentType "application/json"; $tempToken = $loginResponse.tempToken; $loginResponse.message
```

**Login as Manager:**
```
$body = @{email="mgrtest@test.com"; password="mgr123"} | ConvertTo-Json; $loginResponse = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method Post -Body $body -ContentType "application/json"; $tempToken = $loginResponse.tempToken; $loginResponse.message
```

**Login as User:**
```
$body = @{email="usertest@test.com"; password="user123"} | ConvertTo-Json; $loginResponse = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method Post -Body $body -ContentType "application/json"; $tempToken = $loginResponse.tempToken; $loginResponse.message
```

---

### Step 5: Verify 2FA and get JWT token
(Replace `123456` with the current code from your authenticator app)

**Admin:**
```
$code = "123456"; $body = @{tempToken=$tempToken; code=$code} | ConvertTo-Json; $response = Invoke-RestMethod -Uri http://localhost:3000/auth/verify-2fa -Method Post -Body $body -ContentType "application/json"; $token = $response.token; $response.message
```

**Manager:**
```
$code = "123456"; $body = @{tempToken=$tempToken; code=$code} | ConvertTo-Json; $response = Invoke-RestMethod -Uri http://localhost:3000/auth/verify-2fa -Method Post -Body $body -ContentType "application/json"; $token = $response.token; $response.message
```

**User:**
```
$code = "123456"; $body = @{tempToken=$tempToken; code=$code} | ConvertTo-Json; $response = Invoke-RestMethod -Uri http://localhost:3000/auth/verify-2fa -Method Post -Body $body -ContentType "application/json"; $token = $response.token; $response.message
```

---

### Step 6: Test protected routes
(First login as the role you want to test, then use these)

**Dashboard (any role):**
```
Invoke-RestMethod -Uri http://localhost:3000/dashboard -Headers @{Authorization="Bearer $token"}
```

**Profile (any role):**
```
Invoke-RestMethod -Uri http://localhost:3000/profile -Headers @{Authorization="Bearer $token"}
```

**Admin page (admin only):**
```
Invoke-RestMethod -Uri http://localhost:3000/admin -Headers @{Authorization="Bearer $token"}
```

**Manager page (manager only):**
```
Invoke-RestMethod -Uri http://localhost:3000/manager -Headers @{Authorization="Bearer $token"}
```

**User page (user only):**
```
Invoke-RestMethod -Uri http://localhost:3000/user -Headers @{Authorization="Bearer $token"}
```

---

### Step 7: Test unauthorized access (no token)
```
Invoke-RestMethod -Uri http://localhost:3000/dashboard
```

Should return: `Access denied. No token provided.`

---

### Step 8: Test role blocking
Login as one role, then try to access a different role's page. Example: Login as User, then:
```
Invoke-RestMethod -Uri http://localhost:3000/admin -Headers @{Authorization="Bearer $token"}
```
Should return: `Access denied. Insufficient permissions.`

---

Save this as `testing_script.txt` in your project folder!