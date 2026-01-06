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

### 9. What metrics should you monitor for a REST API?

**Answer:**

Monitoring REST APIs requires a mix of infrastructure, service, and business metrics. Key metrics to track:

- **Availability / Uptime:** Percent of successful health checks and successful responses (use for SLOs).
- **Request Rate (RPS / TPS):** Requests per second; detect traffic spikes or drops.
- **Latency (P50 / P95 / P99):** End-to-end response times; track percentiles rather than averages.
- **Error Rate (4xx / 5xx):** Ratio or count of client/server errors; alert on spikes in 5xx or unusual 4xx patterns.
- **Success Rate:** Complement of error rate; useful for SLOs (e.g., 99.9% success).
- **Throughput (bytes/sec):** Bandwidth for requests/responses; useful for capacity planning.
- **Timeouts & Retries:** Count and rate of timeouts and retries — indicates downstream slowness.
- **Concurrent Requests / Concurrency:** In-flight requests per instance; signals saturation.
- **Queue Length / Backlog:** Pending requests or worker queue size (for async workers).
- **Resource Utilization:** CPU, memory, disk, file descriptors per host/container.
- **GC / Runtime Metrics:** GC pause times, thread pool usage (JVM/.NET/node specifics) that affect latency.
- **DB & Cache Metrics:** DB query latency, connection count, slow queries, cache hit/miss rates.
- **Downstream Dependency Metrics:** Latency/error rate of services the API calls (third-parties, DB, auth).
- **Replication / Sync Lag:** For read replicas; important if API serves stale reads.
- **Rate Limit / Throttle Metrics:** Counts of throttled or rejected requests.
- **Authentication / Authorization Failures:** Spike could indicate misconfig or attacks.
- **Tracing Coverage & Span Latency:** % of requests traced and per-span durations for distributed tracing.
- **Business KPIs:** Relevant business events (signups, purchases) to correlate with infra issues.

**Practical guidance & alerts:**

- Alert on P95/P99 latency breaches rather than mean latency.
- Alert on sustained high error rate (e.g., 5xx > 0.5% for 5 minutes) and on sudden RPS drops.
- Correlate increased latency with CPU, GC pauses, or downstream errors before scaling up.
- Use synthetic checks (health probes) plus real-user metrics (RUM) for coverage.

---

### 10. What are REST API versioning patterns?

**Answer:**

REST API versioning allows you to make breaking changes while maintaining backward compatibility for existing clients. There are several common patterns:

**1. URL Path Versioning (Most Common)**

```
GET /api/v1/users
GET /api/v2/users
GET /api/v3/orders
```

**Pros:**
- Clear and visible in URLs
- Excellent for HTTP caching (separate cache entries per version)
- Easy to debug and test in browser
- Each version can have different backend implementations

**Cons:**
- Verbose URLs
- Requires separate endpoint definitions
- More code duplication

**Best for:** Public APIs, when breaking changes are frequent

**2. Query Parameter Versioning**

```
GET /api/users?version=1
GET /api/users?v=2
GET /api/orders?api-version=3
```

**Pros:**
- Single URL for all versions (cleaner URLs)
- Easy to implement on client side

**Cons:**
- Easy to forget or miss in client code
- Cache treats each query parameter as separate URL
- Not SEO-friendly
- Less visible in documentation

**Best for:** Internal APIs, backward-compatible changes

**3. Header Versioning (Accept Header)**

```
GET /api/users
Accept: application/vnd.company.v1+json

OR (Custom Header)

GET /api/users
X-API-Version: 2
```

**Pros:**
- Clean URLs (RESTful)
- Semantic meaning using vendor prefixes (`vnd.company.v1`)
- Single endpoint for all versions

**Cons:**
- Not visible in URL (harder to debug)
- Hard to test in browser
- Caching complications (headers not always considered)
- Less discoverable for API consumers

**Best for:** Enterprise/internal APIs, REST purists

**4. Subdomain Versioning**

```
GET https://v1.api.example.com/users
GET https://v2.api.example.com/users
GET https://api-v3.example.com/users
```

**Pros:**
- Clear separation per version
- Can deploy versions independently
- Good for load balancing per version

**Cons:**
- Requires DNS/infrastructure setup
- SSL certificate complexity
- More operational overhead

**Best for:** Large scale APIs with separate backend deployments

**5. No Explicit Versioning (Additive Only)**

```javascript
// v1 response
GET /api/users
{ id: 1, name: "John", email: "john@example.com" }

// v2 response (add new fields, never remove)
GET /api/users
{ id: 1, name: "John", email: "john@example.com", phone: "555-1234", address: "123 Main St" }
```

**Pros:**
- Simplest approach
- No versioning overhead
- Excellent caching
- Single endpoint

**Cons:**
- Only works if always additive (can't remove/rename fields)
- Can lead to API bloat over time
- Doesn't work for structural changes

**Best for:** Small internal APIs, strict backward compatibility requirement

---

**Comparison Table:**

| Pattern | URL Clarity | Caching | Browser Testable | Complexity |
|---------|------------|---------|-----------------|-----------|
| **URL Path** (`/v1/`) | Excellent | Excellent | Yes | Medium |
| **Query Param** | Good | Poor | Yes | Low |
| **Header** | Excellent | Poor | No | Low |
| **Subdomain** | Good | Excellent | Yes | High |
| **No Version** | Excellent | Excellent | Yes | Low |

---

**Deprecation & Lifecycle Best Practices:**

```
Timeline Example:
- v1 launches → stable for 2 years
- v2 launches with breaking changes
- v1 deprecation notice announced (notify users 3+ months ahead)
  Response header: Deprecation: true, Sunset: Thu, 31 Dec 2025 23:59:59 GMT
- v1 supported for 6 months alongside v2
- v1 sunset → only v2 supported (remove from load balancer)
```

**Example deprecation headers:**

```
HTTP/1.1 200 OK
Deprecation: true
Sunset: Thu, 31 Dec 2025 23:59:59 GMT
Link: </api/v2/users>; rel="successor-version"
Content-Type: application/json

{ "id": 1, "name": "John" }
```

**Backward Compatibility Guidelines:**

1. **Always extend, never remove:** Add new fields, don't delete old ones
2. **Keep default behavior:** Old clients should work without changes
3. **Make new fields optional:** Support both old and new request formats
4. **Gradual rollout:** Use feature flags for major changes

**Example (JavaScript):**

```javascript
// Client-side version detection
class APIClient {
  constructor(version = 'v1') {
    this.baseURL = `https://api.example.com/${version}`;
    this.version = version;
  }

  async getUsers() {
    return fetch(`${this.baseURL}/users`);
  }

  // Handle different response formats
  async getUsersV1() {
    const response = await fetch(`${this.baseURL}/users`);
    return response.json(); // Returns { id, name }
  }

  async getUsersV2() {
    const response = await fetch(`${this.baseURL}/users`);
    const data = response.json(); // Returns { id, name, email, phone }
    return data;
  }
}

// Usage
const clientV1 = new APIClient('v1');
const clientV2 = new APIClient('v2');
```

**Recommendation:**

Use **URL path versioning** (`/api/v1/`, `/api/v2/`) for most REST APIs because:
- Clear and discoverable
- Excellent HTTP caching
- Easy to debug and document
- Standard industry practice
- Works well with API gateways and load balancers

---

### 11. What are the main REST API design patterns?

**Answer:**

REST API design patterns establish conventions for building scalable, maintainable, and developer-friendly APIs. Here are the key patterns:

**1. Resource-Oriented Design**

Structure URLs around resources (nouns), not actions (verbs):

```
✓ Good:
GET    /api/users               # List users
POST   /api/users               # Create user
GET    /api/users/123           # Get user
PUT    /api/users/123           # Replace user
PATCH  /api/users/123           # Partial update
DELETE /api/users/123           # Delete user

✗ Bad (RPC-style):
POST /api/getUser
POST /api/createUser
POST /api/updateUser
```

**2. Richardson Maturity Model (REST Maturity Levels)**

```
Level 0: RPC-style (no REST)
  POST /api?action=getUser&id=1

Level 1: Resources
  GET /api/users/1

Level 2: HTTP Verbs (proper use of HTTP methods)
  GET /api/users/1
  POST /api/users
  PUT /api/users/1
  DELETE /api/users/1

Level 3: HATEOAS (Hypermedia As The Engine Of Application State)
  Response includes links to related resources
```

**3. HATEOAS Pattern (Discoverability)**

Include links in responses to guide clients to next actions:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "links": {
    "self": { "href": "/api/users/1", "method": "GET" },
    "all_users": { "href": "/api/users", "method": "GET" },
    "update": { "href": "/api/users/1", "method": "PUT" },
    "delete": { "href": "/api/users/1", "method": "DELETE" },
    "posts": { "href": "/api/users/1/posts", "method": "GET" }
  }
}
```

**Benefits:** Client doesn't need to hard-code URLs; self-documenting API.

**4. Pagination Pattern**

For large datasets, return paginated results:

```
GET /api/users?page=1&limit=10
GET /api/users?offset=0&limit=10
GET /api/users?cursor=abc123&limit=10  # Cursor-based (for large datasets)

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "next": "/api/users?page=2&limit=10",
    "prev": null
  }
}
```

**5. Filtering & Sorting Pattern**

Allow clients to customize results:

```
GET /api/users?status=active&role=admin         # Filtering
GET /api/users?sort=name,-created_at            # Sorting (+ ascending, - descending)
GET /api/users?search=john&fields=id,name      # Search & sparse fieldsets
GET /api/users?include=posts,comments           # Include related resources
```

**6. API Gateway Pattern**

Centralized entry point for routing, auth, rate limiting, logging:

```
Client ──> API Gateway ──> Auth Service
              │           ├─> User Service
              │           ├─> Product Service
              │           └─> Order Service
```

**Benefits:** Centralized security, logging, rate limiting; service discovery.

**7. BFF (Backend for Frontend) Pattern**

Different backends optimized for different client types:

```
Web Client ──> Web BFF (optimized for web)
Mobile Client ──> Mobile BFF (optimized for mobile)
               │
               ├─> Shared Services (Auth, Users, Products)
```

**Benefits:** Tailor API response for each client; avoid over-fetching/under-fetching.

**8. Idempotency Pattern**

Ensure same request produces same result (safe for retries):

```
POST /api/payments
Headers: Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

First request: 201 Created (charge created)
Retry with same key: 200 OK (returns same charge, doesn't duplicate)
```

**Implementation:**
```javascript
const idempotencyKeys = new Map();

app.post('/payments', (req, res) => {
  const key = req.headers['idempotency-key'];
  
  // If key exists, return cached result
  if (idempotencyKeys.has(key)) {
    return res.json(idempotencyKeys.get(key));
  }
  
  // Process payment
  const result = processPayment(req.body);
  idempotencyKeys.set(key, result);
  
  res.status(201).json(result);
});
```

**9. Error Handling Pattern**

Consistent, structured error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "issue": "Invalid email format" },
      { "field": "age", "issue": "Must be >= 18" }
    ]
  }
}
```

**10. Caching Pattern**

Use HTTP caching headers for performance:

```
GET /api/users/123

Response Headers:
  Cache-Control: public, max-age=3600
  ETag: "abc123def456"
  Last-Modified: Wed, 06 Jan 2026 10:00:00 GMT

Subsequent request with If-None-Match: "abc123def456"
  Response: 304 Not Modified (no body, save bandwidth)
```

**11. Rate Limiting Pattern**

Protect API from abuse:

```
Response Headers:
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1609459200

When exceeded:
  429 Too Many Requests
  Retry-After: 60  # Retry after 60 seconds
```

**12. Webhook Pattern (Push vs Pull)**

Instead of client polling, server pushes events:

```
1. Register webhook:
   POST /webhooks
   { "url": "https://myapp.com/hooks/payment", "events": ["payment.completed"] }

2. Event occurs on server
3. Server pushes to webhook URL:
   POST https://myapp.com/hooks/payment
   { "event": "payment.completed", "data": {...}, "timestamp": "2026-01-06T10:00:00Z" }

4. Client acknowledges:
   200 OK or 202 Accepted
```

**13. Batch Request Pattern**

Allow multiple operations in single request:

```
POST /api/batch
{
  "requests": [
    { "method": "GET", "path": "/users/1" },
    { "method": "POST", "path": "/posts", "body": {...} },
    { "method": "DELETE", "path": "/users/2" }
  ]
}

Response:
{
  "responses": [
    { "status": 200, "body": {...} },
    { "status": 201, "body": {...} },
    { "status": 204, "body": null }
  ]
}
```

**14. Authentication Patterns**

```
# API Key
Authorization: Bearer abc123def456

# Basic Auth
Authorization: Basic base64(username:password)

# JWT Token
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# OAuth 2.0
Authorization: Bearer <access_token>
```

**15. Soft Delete Pattern**

Mark resources as deleted instead of removing:

```javascript
// Instead of DELETE /api/users/123
PATCH /api/users/123
{ "deleted_at": "2026-01-06T10:00:00Z" }

// Query excludes soft-deleted by default
GET /api/users  # Returns only non-deleted users

// Include deleted if needed
GET /api/users?include_deleted=true
```

**Benefits:** Data recovery, audit trails, referential integrity.

**16. Async Operations Pattern**

For long-running operations, return 202 Accepted with status URL:

```
POST /api/reports/generate
Response: 202 Accepted
{
  "id": "report-123",
  "status": "processing",
  "status_url": "/api/reports/report-123/status"
}

Client polls:
GET /api/reports/report-123/status
Response:
{
  "id": "report-123",
  "status": "completed",
  "result_url": "/api/reports/report-123/result"
}
```

**17. Content Negotiation Pattern**

Support multiple response formats:

```
GET /api/users/123
Accept: application/json        # Returns JSON
Accept: application/xml         # Returns XML
Accept: text/csv                # Returns CSV
```

**18. Partial Response / Sparse Fieldsets**

Allow clients to request only needed fields:

```
GET /api/users/123?fields=id,name,email
Response:
{ "id": 1, "name": "John", "email": "john@example.com" }

vs default:
{ "id": 1, "name": "John", "email": "john@example.com", "phone": "...", "address": "...", ... }
```

---

**Best Practices Summary:**

1. **Use resource-based URLs** with nouns, not verbs
2. **Use HTTP methods correctly** (GET, POST, PUT, PATCH, DELETE)
3. **Return appropriate status codes** (200, 201, 400, 401, 403, 404, 500)
4. **Use JSON** for request/response bodies
5. **Implement pagination** for large datasets
6. **Support filtering, sorting, and searching**
7. **Use consistent error response format**
8. **Implement idempotency** for safe retries
9. **Use HATEOAS** for discoverability
10. **Document thoroughly** (Swagger/OpenAPI)
11. **Implement rate limiting** and throttling
12. **Use proper authentication/authorization**
13. **Support caching** with appropriate headers
14. **Version your API** for breaking changes
15. **Use API Gateway** for cross-cutting concerns

**Design Comparison:**

| Pattern | Complexity | Performance | Discoverability | Use Case |
|---------|-----------|------------|-----------------|----------|
| **Basic REST** | Low | Good | Medium | Simple internal APIs |
| **REST + HATEOAS** | Medium | Good | Excellent | Public APIs, discoverability important |
| **GraphQL** | Medium | Excellent | Good | Complex, flexible queries needed |
| **gRPC** | High | Excellent | Low | Microservices, high-performance needs |

---

### 12. How do you secure an API?

**Answer:**
Securing an API requires implementing multiple layers of protection including authentication, authorization, encryption, input validation, and monitoring. Here's a comprehensive approach:

**1. Authentication Methods**

**API Key Authentication:**
```javascript
// Simple but less secure - suitable for internal/development APIs
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid API Key' });
  }
});
```

**JWT (JSON Web Token) Authentication:**
```javascript
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

// Generate token on login
app.post('/login', (req, res) => {
  const user = { id: 1, email: 'user@example.com' };
  const token = jwt.sign(user, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
});
```

**OAuth 2.0 (Third-party authentication):**
```javascript
// Using passport with Google OAuth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Store/verify user and return
  return done(null, profile);
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT from Google profile
    const token = jwt.sign({ id: req.user.id }, SECRET);
    res.redirect(`/dashboard?token=${token}`);
  }
);
```

**2. Authorization (Role-Based Access Control)**

```javascript
// Middleware for RBAC
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Usage
app.delete('/admin/users/:id', 
  verifyToken, 
  authorize(['admin']), 
  (req, res) => {
    // Delete user
    res.json({ message: 'User deleted' });
  }
);
```

**3. Encryption & HTTPS**

```javascript
// Force HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(\`https://\${req.header('host')}\${req.url}\`);
  } else {
    next();
  }
});

// Data encryption
const crypto = require('crypto');

const encryptData = (data, secret) => {
  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decryptData = (encrypted, secret) => {
  const decipher = crypto.createDecipher('aes-256-cbc', secret);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
```

**4. Input Validation & Sanitization**

```javascript
const { body, validationResult } = require('express-validator');

app.post('/users', 
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim().escape(),
  body('name').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process validated data
    res.json({ message: 'User created' });
  }
);

// SQL Injection Prevention - Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ? AND role = ?';
db.query(query, [email, role], (err, results) => {
  // Safe from SQL injection
});
```

**5. Rate Limiting & Throttling**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all requests
app.use(limiter);

// Apply to specific endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts
  skipSuccessfulRequests: true, // Don't count successful attempts
});

app.post('/login', loginLimiter, (req, res) => {
  // Login logic
});
```

**6. CORS (Cross-Origin Resource Sharing)**

```javascript
const cors = require('cors');

// Strict CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Don't use wildcard in production
// ❌ app.use(cors()); // Too permissive
```

**7. Security Headers**

```javascript
const helmet = require('helmet');

app.use(helmet());

// Individual headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Prevent caching sensitive data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  
  next();
});
```

**8. Secure Error Handling**

```javascript
// ❌ Bad - Exposes sensitive info
app.get('/data', (req, res) => {
  try {
    const data = risky_operation();
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// ✅ Good - Generic error response
app.get('/data', (req, res) => {
  try {
    const data = risky_operation();
  } catch (err) {
    console.error('Error:', err); // Log internally
    res.status(500).json({ error: 'Internal server error' }); // Generic response
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error'
      : err.message
  });
});
```

**9. Logging & Monitoring**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log all requests
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date()
  });
  next();
});

// Alert on suspicious activity
app.use((req, res, next) => {
  if (req.path.includes('admin') && !req.user?.isAdmin) {
    logger.warn({
      event: 'unauthorized_admin_access_attempt',
      ip: req.ip,
      timestamp: new Date()
    });
  }
  next();
});
```

**10. Refresh Token Strategy**

```javascript
// Short-lived access token + long-lived refresh token
app.post('/login', (req, res) => {
  const user = { id: 1, email: 'user@example.com' };
  
  const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: '7d' });
  
  res.json({ 
    accessToken, 
    refreshToken 
  });
});

// Refresh endpoint
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(decoded, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

**11. Common Vulnerabilities to Prevent**

| Vulnerability | Prevention |
|---------------|-----------|
| **SQL Injection** | Use parameterized queries, ORM validation |
| **XSS (Cross-Site Scripting)** | Sanitize input, escape output, CSP headers |
| **CSRF (Cross-Site Request Forgery)** | CSRF tokens, SameSite cookies |
| **Insecure Deserialization** | Validate data structure, use safe parsers |
| **Security Misconfiguration** | Use security headers, disable debug mode |
| **Broken Authentication** | Proper JWT implementation, MFA support |
| **Broken Authorization** | Validate permissions on every request |
| **Sensitive Data Exposure** | Encrypt in transit (HTTPS) and at rest |
| **XML External Entities (XXE)** | Disable external entities in XML parsers |
| **Broken Access Control** | Implement proper RBAC/ABAC |

**12. Complete Secure API Example**

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Authentication middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Authorization middleware
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Routes
app.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = { id: 1, email: req.body.email, role: 'user' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  }
);

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
});

app.delete('/admin/users/:id', 
  verifyToken, 
  authorize(['admin']),
  (req, res) => {
    res.json({ message: 'User deleted' });
  }
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error'
      : err.message
  });
});

app.listen(3000, () => console.log('Secure API running on port 3000'));
```

**Security Checklist:**

- [ ] Authentication implemented (JWT/OAuth)
- [ ] Authorization (RBAC) configured
- [ ] HTTPS/TLS enforced
- [ ] Input validation and sanitization in place
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set (Helmet)
- [ ] Error handling doesn't expose sensitive info
- [ ] Logging and monitoring active
- [ ] Refresh token strategy implemented
- [ ] Secrets managed securely (environment variables)
- [ ] Regular security updates applied
- [ ] Dependencies scanned for vulnerabilities
- [ ] API versioning strategy in place
- [ ] Documentation includes security best practices

---

## Summary

This guide covers essential security interview questions including:

1. **Authentication**: SSO, 2FA/MFA, JWT tokens, OAuth, SAML
2. **Encryption**: Encryption vs hashing, public/private keys, cryptography basics
3. **Web Security**: XSS, CSRF, SQL Injection
4. **Network Security**: HTTPS, SSL/TLS
5. **Application Security**: Secure coding practices
6. **REST API Monitoring & Versioning**: Metrics, patterns, deprecation
7. **REST API Design Patterns**: Resource orientation, HATEOAS, pagination, caching, idempotency
8. **API Security**: Authentication methods, authorization, encryption, input validation, rate limiting, CORS, security headers, error handling, logging, vulnerability prevention
9. **Best Practices**: Security guidelines and standards

Remember to understand both the concepts and practical implementations. Good luck with your security interviews!

