# Security Interview Questions and Answers

This comprehensive guide covers essential security interview questions from basic concepts to advanced topics. Each question includes detailed answers with practical examples.

## Table of Contents

1. [Authentication and Authorization](#authentication-and-authorization)
2. [Encryption and Cryptography](#encryption-and-cryptography)
3. [Web Security](#web-security)
4. [Network Security](#network-security)
5. [Application Security](#application-security)
6. [Best Practices](#best-practices)

---

## Authentication and Authorization

### 1. What is Single Sign-On (SSO)?

**Answer:**
Single Sign-On (SSO) is an authentication method that allows users to authenticate once and gain access to multiple related applications or services without needing to log in again.

**How it Works:**
1. User logs in to an Identity Provider (IdP)
2. IdP issues a token (SAML, JWT, OAuth, etc.)
3. User accesses other applications
4. Applications verify the token with the IdP
5. User is granted access without additional login

**Example Flow:**
```
User → Logs into Company Portal
     → Gets SSO token
     → Accesses Email System (no login needed)
     → Accesses HR System (no login needed)
     → Accesses CRM System (no login needed)
```

**Benefits:**
1. **Better User Experience**: One login for multiple applications
2. **Improved Security**: Centralized authentication and password policies
3. **Reduced Password Fatigue**: Fewer passwords to manage
4. **Easier Administration**: Centralized user management
5. **Lower Support Costs**: Fewer password reset requests

**Common SSO Protocols:**

**1. SAML (Security Assertion Markup Language):**
- XML-based protocol
- Common in enterprise environments
- Used for web-based SSO

**2. OAuth 2.0 / OpenID Connect:**
- Modern, REST-based protocol
- Common in consumer applications
- OAuth for authorization, OpenID Connect for authentication

**3. LDAP / Active Directory:**
- Directory-based authentication
- Common in corporate environments
- Integrated with Windows domains

**4. Kerberos:**
- Network authentication protocol
- Used in Windows environments
- Ticket-based authentication system

**Example Implementation:**

**OAuth 2.0 / OpenID Connect Example:**
```javascript
// User clicks "Login with Google"
// 1. Redirect to Google
window.location = 'https://accounts.google.com/oauth/authorize?client_id=...&redirect_uri=...';

// 2. User authenticates with Google
// 3. Google redirects back with authorization code
// 4. Exchange code for token
fetch('/api/auth/callback', {
  method: 'POST',
  body: JSON.stringify({ code: authorizationCode })
});

// 5. Server validates token with Google
// 6. Server creates session
// 7. User is logged in to all connected apps
```

**SAML Example:**
```xml
<!-- SAML Assertion (simplified) -->
<saml:Assertion>
  <saml:Subject>
    <saml:NameID>user@company.com</saml:NameID>
  </saml:Subject>
  <saml:Conditions>
    <saml:AudienceRestriction>
      <saml:Audience>https://app.company.com</saml:Audience>
    </saml:AudienceRestriction>
  </saml:Conditions>
  <saml:AttributeStatement>
    <saml:Attribute Name="email">
      <saml:AttributeValue>user@company.com</saml:AttributeValue>
    </saml:Attribute>
  </saml:AttributeStatement>
</saml:Assertion>
```

**Common SSO Providers:**

**Enterprise:**
- Microsoft Azure AD
- Okta
- OneLogin
- Ping Identity

**Consumer:**
- Google Sign-In
- Facebook Login
- Apple Sign In
- GitHub OAuth

**Security Considerations:**

**Advantages:**
- Centralized security policies
- Easier to revoke access
- Reduced password reuse
- Centralized audit trail

**Risks:**
- Single point of failure
- If SSO is compromised, all applications are at risk
- Requires robust security at the Identity Provider

**Real-World Example:**

**Scenario:**
A company uses Microsoft Azure AD for SSO. Employees:
1. Log in to their Windows computer (authenticated with Azure AD)
2. Open Outlook → No login needed (uses SSO)
3. Access SharePoint → No login needed
4. Use company CRM → No login needed
5. Access HR portal → No login needed

All these applications trust Azure AD and accept the SSO token.

**Implementation Best Practices:**
1. Use HTTPS for all SSO communications
2. Implement token expiration and refresh
3. Use strong encryption for tokens
4. Implement proper session management
5. Monitor and log all SSO activities
6. Use multi-factor authentication (MFA) with SSO
7. Implement proper error handling

### 2. What is Two-Step Authentication (2FA) / Two-Factor Authentication?

**Answer:**
Two-Step Authentication (2FA) or Two-Factor Authentication is a security process that requires users to provide two different authentication factors to verify their identity. It adds an extra layer of security beyond just a username and password.

**Authentication Factors:**
1. **Something You Know**: Password, PIN, security question
2. **Something You Have**: Mobile device, security token, smart card
3. **Something You Are**: Biometric (fingerprint, face recognition, voice)

**How 2FA Works:**
1. User enters username and password (first factor)
2. System prompts for second factor
3. User provides second factor (code, biometric, etc.)
4. System verifies both factors
5. Access granted if both factors are valid

**Example Flow:**
```
User → Enters username and password
     → System sends code to mobile device
     → User enters code from mobile device
     → Access granted
```

**Types of 2FA:**

**1. SMS-Based 2FA:**
- Code sent via text message
- Simple to implement
- Vulnerable to SIM swapping attacks

**Example:**
```javascript
// User login flow
async function login(username, password) {
  // Step 1: Verify password
  const user = await verifyPassword(username, password);
  
  // Step 2: Send SMS code
  const code = generateCode();
  await sendSMS(user.phone, code);
  await storeCode(user.id, code);
  
  // Step 3: User enters code
  // Step 4: Verify code
  const isValid = await verifyCode(user.id, enteredCode);
  if (isValid) {
    return createSession(user);
  }
}
```

**2. Authenticator App (TOTP):**
- Time-based One-Time Password (TOTP)
- Apps: Google Authenticator, Microsoft Authenticator, Authy
- More secure than SMS
- Works offline

**Example:**
```javascript
// Generate QR code for setup
const secret = generateSecret();
const qrCode = `otpauth://totp/MyApp:user@example.com?secret=${secret}&issuer=MyApp`;

// Verify TOTP code
const speakeasy = require('speakeasy');
const isValid = speakeasy.totp.verify({
  secret: user.secret,
  encoding: 'base32',
  token: userEnteredCode,
  window: 2  // Allow 2 time steps before/after
});
```

**3. Email-Based 2FA:**
- Code sent via email
- Less secure (email can be compromised)
- Easy to implement

**4. Hardware Tokens:**
- Physical devices (USB keys, smart cards)
- Very secure
- Examples: YubiKey, RSA SecurID

**5. Push Notifications:**
- Push notification to mobile app
- User approves/denies
- Good user experience
- Examples: Duo Security, Okta Verify

**6. Biometric 2FA:**
- Fingerprint, face recognition, voice
- Convenient for users
- Requires specialized hardware

**Implementation Example:**

**Backend (Node.js):**
```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Setup 2FA for user
async function setup2FA(userId) {
  const secret = speakeasy.generateSecret({
    name: `MyApp (${user.email})`,
    issuer: 'MyApp'
  });
  
  // Store secret in database
  await db.users.update(userId, { 
    twoFactorSecret: secret.base32,
    twoFactorEnabled: false
  });
  
  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  
  return { secret: secret.base32, qrCode: qrCodeUrl };
}

// Verify 2FA code
async function verify2FA(userId, token) {
  const user = await db.users.findById(userId);
  
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  return verified;
}

// Login with 2FA
async function loginWith2FA(username, password, twoFactorCode) {
  // Step 1: Verify password
  const user = await verifyPassword(username, password);
  
  if (!user.twoFactorEnabled) {
    return { error: '2FA not enabled' };
  }
  
  // Step 2: Verify 2FA code
  const isValid = await verify2FA(user.id, twoFactorCode);
  
  if (!isValid) {
    return { error: 'Invalid 2FA code' };
  }
  
  // Step 3: Create session
  return createSession(user);
}
```

**Frontend (React):**
```javascript
function LoginForm() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  
  const handleLogin = async () => {
    if (step === 1) {
      // Step 1: Verify password
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        setStep(2);  // Move to 2FA step
      }
    } else {
      // Step 2: Verify 2FA code
      const response = await fetch('/api/verify-2fa', {
        method: 'POST',
        body: JSON.stringify({ username, code })
      });
      
      if (response.ok) {
        // Login successful
        window.location.href = '/dashboard';
      }
    }
  };
  
  return (
    <div>
      {step === 1 ? (
        <div>
          <input value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>Enter 2FA code from your authenticator app:</p>
          <input value={code} onChange={e => setCode(e.target.value)} />
          <button onClick={handleLogin}>Verify</button>
        </div>
      )}
    </div>
  );
}
```

**Benefits of 2FA:**
1. **Enhanced Security**: Even if password is compromised, attacker needs second factor
2. **Protection Against Phishing**: Phishing attacks become less effective
3. **Compliance**: Meets many regulatory requirements (PCI DSS, HIPAA)
4. **User Trust**: Users feel more secure
5. **Reduced Account Takeover**: Significantly reduces unauthorized access

**Challenges:**
1. **User Experience**: Additional step can be inconvenient
2. **Device Dependency**: Requires access to second factor device
3. **Recovery**: Lost device can lock users out
4. **Cost**: SMS-based 2FA has per-message costs
5. **Implementation Complexity**: Requires additional development

**Best Practices:**
1. **Backup Codes**: Provide recovery codes when 2FA is enabled
2. **Multiple Methods**: Allow users to choose 2FA method
3. **Remember Device**: Option to remember trusted devices
4. **Rate Limiting**: Limit 2FA verification attempts
5. **Secure Storage**: Encrypt 2FA secrets in database
6. **User Education**: Educate users on importance of 2FA
7. **Fallback Options**: Provide alternative authentication methods

**2FA vs MFA:**
- **2FA**: Exactly two factors required
- **MFA (Multi-Factor Authentication)**: Two or more factors required
- 2FA is a subset of MFA

**Real-World Examples:**
- **Banking**: Login + SMS code or authenticator app
- **Email**: Password + mobile device verification
- **Cloud Services**: Password + push notification
- **Corporate**: Password + hardware token

**Security Considerations:**
- SMS-based 2FA is vulnerable to SIM swapping
- TOTP (authenticator apps) is more secure than SMS
- Hardware tokens provide highest security
- Biometric 2FA is convenient but can have privacy concerns

### 3. What is a JWT (JSON Web Token)?

**Answer:**
JWT (JSON Web Token) is a compact, URL-safe token format used for securely transmitting information between parties. It's commonly used for authentication and authorization in web applications and APIs.

**JWT Structure:**
A JWT consists of three parts separated by dots (`.`):
```
header.payload.signature
```

**1. Header:**
- Contains token type (JWT) and signing algorithm
- Base64Url encoded

**2. Payload:**
- Contains claims (data about the user)
- Base64Url encoded
- Can include standard claims (iss, exp, sub) and custom claims

**3. Signature:**
- Used to verify token hasn't been tampered with
- Created using header, payload, and secret key

**Example JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Decoded:**
```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}

// Signature (verified with secret)
```

**How JWT Works:**

**1. Token Creation (Login):**
```
User → Logs in with credentials
     → Server validates credentials
     → Server creates JWT with user info
     → Server sends JWT to client
     → Client stores JWT (localStorage, cookie, etc.)
```

**2. Token Usage (API Requests):**
```
Client → Makes API request with JWT in header
       → Server verifies JWT signature
       → Server extracts user info from payload
       → Server processes request
```

**Example Implementation:**

**Node.js (Creating JWT):**
```javascript
const jwt = require('jsonwebtoken');

// Create JWT
function createToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,  // Secret key
    {
      expiresIn: '1h',        // Token expires in 1 hour
      issuer: 'myapp.com',    // Who issued the token
      audience: 'myapp.com'    // Who the token is for
    }
  );
  
  return token;
}

// Usage
const user = { id: 123, email: 'user@example.com', role: 'admin' };
const token = createToken(user);
console.log(token);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Node.js (Verifying JWT):**
```javascript
const jwt = require('jsonwebtoken');

// Verify JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'myapp.com',
      audience: 'myapp.com'
    });
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

// Middleware for Express
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;  // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
}

// Usage in route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

**Frontend (Using JWT):**
```javascript
// Login and store token
async function login(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);  // Store token
  return data.token;
}

// Make authenticated requests
async function fetchUserProfile() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  
  return response.json();
}
```

**JWT Claims:**

**Standard Claims (Registered Claims):**
- `iss` (issuer): Who issued the token
- `sub` (subject): Subject of the token (usually user ID)
- `aud` (audience): Who the token is intended for
- `exp` (expiration): Token expiration time (Unix timestamp)
- `nbf` (not before): Token not valid before this time
- `iat` (issued at): When token was issued
- `jti` (JWT ID): Unique identifier for the token

**Custom Claims:**
```javascript
const payload = {
  // Standard claims
  sub: 'user123',
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
  iat: Math.floor(Date.now() / 1000),
  
  // Custom claims
  userId: 123,
  email: 'user@example.com',
  role: 'admin',
  permissions: ['read', 'write', 'delete']
};
```

**JWT Signing Algorithms:**

**1. HS256 (HMAC with SHA-256):**
- Symmetric algorithm (same secret for signing and verification)
- Fast and simple
- Secret must be shared between parties

```javascript
jwt.sign(payload, 'secret-key', { algorithm: 'HS256' });
```

**2. RS256 (RSA with SHA-256):**
- Asymmetric algorithm (private key signs, public key verifies)
- More secure
- Public key can be shared

```javascript
const privateKey = fs.readFileSync('private.key');
const publicKey = fs.readFileSync('public.key');

// Sign with private key
jwt.sign(payload, privateKey, { algorithm: 'RS256' });

// Verify with public key
jwt.verify(token, publicKey, { algorithm: 'RS256' });
```

**3. ES256 (ECDSA with P-256 and SHA-256):**
- Elliptic curve algorithm
- Smaller keys, same security
- Efficient

**JWT vs Session Tokens:**

| Feature | JWT | Session Token |
|---------|-----|---------------|
| **Storage** | Client-side (localStorage, cookie) | Server-side (database, memory) |
| **Stateless** | Yes (no server storage needed) | No (requires server storage) |
| **Scalability** | Better (no shared storage) | Requires shared session store |
| **Revocation** | Difficult (must wait for expiry) | Easy (delete from store) |
| **Size** | Larger (includes payload) | Smaller (just ID) |
| **Security** | Depends on implementation | Server-controlled |

**JWT Use Cases:**

**1. Authentication:**
```javascript
// User logs in, receives JWT
POST /api/login
Response: { token: "eyJhbGci..." }

// User includes JWT in subsequent requests
GET /api/protected
Headers: { Authorization: "Bearer eyJhbGci..." }
```

**2. API Authentication:**
- Microservices authentication
- Mobile app authentication
- Third-party API access

**3. Information Exchange:**
- Securely transmit user information
- Single Sign-On (SSO)
- Stateless authentication

**JWT Security Best Practices:**

**1. Use HTTPS:**
- Always transmit JWTs over HTTPS
- Prevents token interception

**2. Set Expiration:**
```javascript
jwt.sign(payload, secret, { expiresIn: '15m' });  // Short expiration
```

**3. Use Refresh Tokens:**
```javascript
// Access token (short-lived)
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

// Refresh token (long-lived, stored securely)
const refreshToken = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

// When access token expires, use refresh token to get new one
```

**4. Validate Token Properly:**
```javascript
jwt.verify(token, secret, {
  issuer: 'myapp.com',
  audience: 'myapp.com',
  algorithms: ['HS256']  // Specify allowed algorithms
});
```

**5. Don't Store Sensitive Data:**
```javascript
// ❌ Bad
const payload = {
  password: user.password,  // Never include passwords
  creditCard: user.creditCard  // Never include sensitive data
};

// ✅ Good
const payload = {
  userId: user.id,
  email: user.email,
  role: user.role
};
```

**6. Use Strong Secrets:**
```javascript
// Generate strong secret
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
```

**7. Implement Token Blacklisting (if needed):**
```javascript
// Store revoked tokens in Redis/database
const revokedTokens = new Set();

function revokeToken(token) {
  revokedTokens.add(token);
}

function isTokenRevoked(token) {
  return revokedTokens.has(token);
}
```

**Common JWT Vulnerabilities:**

**1. Algorithm Confusion:**
- Attacker changes algorithm to "none"
- Always specify allowed algorithms

**2. Weak Secret:**
- Use strong, random secrets
- Don't use default or weak secrets

**3. Token Storage:**
- Don't store in localStorage (XSS risk)
- Consider httpOnly cookies
- Use secure storage methods

**4. Token Expiration:**
- Always set expiration
- Use short-lived tokens
- Implement refresh token mechanism

**Example: Complete Authentication Flow:**
```javascript
// 1. Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verify credentials
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create tokens
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Store refresh token in database
  await User.updateOne(
    { id: user.id },
    { refreshToken: await bcrypt.hash(refreshToken, 10) }
  );
  
  res.json({ accessToken, refreshToken });
});

// 2. Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// 3. Refresh token endpoint
app.post('/api/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    
    // Verify refresh token matches stored one
    if (!await bcrypt.compare(refreshToken, user.refreshToken)) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    // Issue new access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});
```

**JWT Libraries:**

**JavaScript/Node.js:**
- `jsonwebtoken` (most popular)
- `jose` (modern, supports JWE)

**Python:**
- `PyJWT`
- `python-jose`

**Java:**
- `jjwt`
- `java-jwt`

**C#:**
- `System.IdentityModel.Tokens.Jwt`

---

## Encryption and Cryptography

### 3. What is the difference between encryption and hashing?

**Answer:**

**Encryption:**
- Two-way process (can be decrypted)
- Uses a key for encryption and decryption
- Used to protect data in transit or at rest
- Examples: AES, RSA, DES

**Hashing:**
- One-way process (cannot be reversed)
- No key required
- Used for data integrity and password storage
- Examples: SHA-256, MD5, bcrypt

**Example:**
```javascript
// Encryption (can be decrypted)
const encrypted = encrypt("Hello", key);
const decrypted = decrypt(encrypted, key);  // "Hello"

// Hashing (cannot be reversed)
const hash = hash("Hello");  // "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
// Cannot get "Hello" back from hash
```

### 4. What are Public Key and Private Key?

**Answer:**
Public and private keys are a pair of cryptographic keys used in asymmetric encryption (also called public-key cryptography). They are mathematically related but serve different purposes.

**Key Concepts:**

**Private Key:**
- **Secret**: Must be kept confidential and never shared
- **Owned by**: One party only
- **Used for**: Decryption and digital signatures
- **Storage**: Securely stored, often encrypted
- **Never transmitted**: Should never be sent over network

**Public Key:**
- **Public**: Can be freely shared with anyone
- **Distributed**: Can be published, shared openly
- **Used for**: Encryption and signature verification
- **Storage**: Can be stored in public directories
- **Freely shared**: Can be distributed to anyone

**How They Work Together:**
1. Keys are mathematically related (generated as a pair)
2. Data encrypted with public key can only be decrypted with private key
3. Data signed with private key can be verified with public key
4. Cannot derive private key from public key (one-way function)

**Example:**
```
Public Key:  Can be shared with everyone
Private Key: Must be kept secret

Encryption Flow:
Sender → Encrypts message with recipient's PUBLIC key
       → Only recipient can decrypt with their PRIVATE key

Digital Signature Flow:
Sender → Signs message with their PRIVATE key
       → Anyone can verify with sender's PUBLIC key
```

**Common Use Cases:**

**1. Encryption (Confidentiality):**
```javascript
// Node.js example using crypto
const crypto = require('crypto');

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Encrypt with public key
function encryptWithPublicKey(data, publicKey) {
  return crypto.publicEncrypt(publicKey, Buffer.from(data));
}

// Decrypt with private key
function decryptWithPrivateKey(encryptedData, privateKey) {
  return crypto.privateDecrypt(privateKey, encryptedData);
}

// Usage
const message = "Secret message";
const encrypted = encryptWithPublicKey(message, publicKey);
const decrypted = decryptWithPrivateKey(encrypted, privateKey);
console.log(decrypted.toString()); // "Secret message"
```

**2. Digital Signatures (Authentication & Integrity):**
```javascript
// Sign with private key
function signData(data, privateKey) {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  return sign.sign(privateKey, 'hex');
}

// Verify with public key
function verifySignature(data, signature, publicKey) {
  const verify = crypto.createVerify('SHA256');
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, signature, 'hex');
}

// Usage
const data = "Important document";
const signature = signData(data, privateKey);
const isValid = verifySignature(data, signature, publicKey);
console.log(isValid); // true
```

**3. SSL/TLS Certificates:**
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate public key (from private key)
openssl rsa -in private.key -pubout -out public.key

# Create certificate signing request
openssl req -new -key private.key -out certificate.csr

# Server has private key, clients get public key via certificate
```

**Real-World Examples:**

**1. HTTPS/SSL:**
- Server has private key
- Server shares public key via SSL certificate
- Browser encrypts data with server's public key
- Only server can decrypt with private key

**2. Email Encryption (PGP/GPG):**
- Each user has public/private key pair
- Public keys shared in key servers
- Encrypt email with recipient's public key
- Recipient decrypts with their private key

**3. SSH Authentication:**
- Server has public key
- Client has private key
- Client authenticates by signing challenge with private key
- Server verifies with client's public key

**4. Cryptocurrency (Bitcoin):**
- Wallet address = public key (or hash of it)
- Private key controls the wallet
- Transactions signed with private key
- Network verifies with public key

**5. Code Signing:**
- Developer signs code with private key
- Users verify signature with developer's public key
- Ensures code hasn't been tampered with

**Key Algorithms:**

**RSA (Rivest-Shamir-Adleman):**
- Most common
- Key sizes: 2048, 4096 bits
- Used for encryption and signatures

**Elliptic Curve Cryptography (ECC):**
- More efficient (smaller keys)
- Same security with smaller keys
- Examples: ECDSA, Ed25519

**Diffie-Hellman:**
- Key exchange protocol
- Establishes shared secret
- Used in TLS handshake

**Key Management Best Practices:**

**Private Key Security:**
1. **Never share**: Private key must remain secret
2. **Encrypt at rest**: Store encrypted when not in use
3. **Strong passphrase**: Protect private key with passphrase
4. **Secure storage**: Use hardware security modules (HSM) for critical keys
5. **Access control**: Limit who can access private keys
6. **Backup securely**: Backup encrypted, store in secure location
7. **Rotation**: Regularly rotate keys

**Public Key Distribution:**
1. **Public directories**: Can publish in key servers
2. **Certificates**: Use certificate authorities (CA) for trust
3. **Web of trust**: PGP/GPG model
4. **Direct exchange**: Share directly with trusted parties

**Example: Secure Key Storage:**
```javascript
// Store private key encrypted
const encryptedPrivateKey = crypto.publicEncrypt(
  masterPublicKey,
  Buffer.from(privateKey)
);

// Store in database or file system
// When needed, decrypt with master private key
const decryptedPrivateKey = crypto.privateDecrypt(
  masterPrivateKey,
  encryptedPrivateKey
);
```

**Symmetric vs Asymmetric Encryption:**

| Feature | Symmetric | Asymmetric |
|---------|-----------|------------|
| **Keys** | One shared key | Public + Private key pair |
| **Speed** | Fast | Slower |
| **Key Distribution** | Difficult (need secure channel) | Easy (public key can be shared) |
| **Use Case** | Bulk data encryption | Key exchange, digital signatures |
| **Examples** | AES, DES, 3DES | RSA, ECC, Diffie-Hellman |

**Hybrid Approach (Common in Practice):**
1. Use asymmetric encryption to exchange symmetric key
2. Use symmetric encryption for actual data (faster)
3. Best of both worlds: security + performance

**Example:**
```javascript
// 1. Generate symmetric key
const symmetricKey = crypto.randomBytes(32);

// 2. Encrypt symmetric key with recipient's public key
const encryptedKey = crypto.publicEncrypt(recipientPublicKey, symmetricKey);

// 3. Encrypt data with symmetric key (faster)
const encryptedData = crypto.createCipher('aes-256-cbc', symmetricKey)
  .update(data, 'utf8', 'hex');

// 4. Send both encrypted key and encrypted data
// Recipient decrypts key with private key, then decrypts data
```

**Common File Formats:**

**Private Key Formats:**
- `.pem` (Privacy-Enhanced Mail) - Base64 encoded
- `.key` - Private key file
- `.p12` / `.pfx` - PKCS#12 (password protected)
- `.jks` - Java KeyStore

**Public Key Formats:**
- `.pem` - Base64 encoded
- `.pub` - Public key file
- `.cer` / `.crt` - Certificate file

**Security Considerations:**

**Risks:**
1. **Private key compromise**: If private key is stolen, attacker can decrypt/impersonate
2. **Weak keys**: Short keys can be broken
3. **Key management**: Difficult to manage many key pairs
4. **Quantum computing**: Future threat to current algorithms

**Mitigations:**
1. Use strong key sizes (2048+ bits for RSA)
2. Implement key rotation
3. Use hardware security modules (HSM)
4. Monitor for key compromise
5. Plan for post-quantum cryptography

---

## Web Security

### 5. What is Cross-Site Scripting (XSS)?

**Answer:**
XSS is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.

**Types:**
1. **Stored XSS**: Malicious script stored in database
2. **Reflected XSS**: Malicious script reflected in response
3. **DOM-based XSS**: Malicious script in DOM manipulation

**Prevention:**
- Input validation and sanitization
- Output encoding
- Content Security Policy (CSP)
- Use frameworks that auto-escape

---

## Network Security

### 6. What is HTTPS and how does it work?

**Answer:**
HTTPS (HTTP Secure) is HTTP over SSL/TLS encryption. It provides:
- Encryption of data in transit
- Authentication of the server
- Data integrity

**How it Works:**
1. Client requests HTTPS connection
2. Server sends SSL certificate
3. Client verifies certificate
4. Encrypted session established
5. Data encrypted during transmission

---

## Application Security

### 7. What is SQL Injection and how do you prevent it?

**Answer:**
SQL Injection is a code injection technique that exploits security vulnerabilities in database queries.

**Example:**
```sql
-- Vulnerable code
SELECT * FROM users WHERE username = '$username' AND password = '$password'

-- Attack
username: admin' OR '1'='1
-- Results in:
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = ''
```

**Prevention:**
- Use parameterized queries/prepared statements
- Input validation
- Least privilege database access
- Use ORM frameworks

---

## Best Practices

### 8. What are security best practices for web applications?

**Answer:**

1. **Authentication:**
   - Use strong password policies
   - Implement multi-factor authentication
   - Use secure session management
   - Implement account lockout policies

2. **Authorization:**
   - Principle of least privilege
   - Role-based access control (RBAC)
   - Regular access reviews

3. **Data Protection:**
   - Encrypt sensitive data at rest and in transit
   - Use HTTPS for all communications
   - Implement proper key management

4. **Input Validation:**
   - Validate all user inputs
   - Sanitize inputs
   - Use whitelist validation

5. **Error Handling:**
   - Don't expose sensitive information in errors
   - Log errors securely
   - Use generic error messages for users

6. **Security Headers:**
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

---

## Summary

This guide covers essential security interview questions including:

1. **Authentication**: SSO, 2FA/MFA, JWT tokens, OAuth, SAML
2. **Encryption**: Encryption vs hashing, public/private keys, cryptography basics
3. **Web Security**: XSS, CSRF, SQL Injection
4. **Network Security**: HTTPS, SSL/TLS
5. **Application Security**: Secure coding practices
6. **Best Practices**: Security guidelines and standards

Remember to understand both the concepts and practical implementations. Good luck with your security interviews!

