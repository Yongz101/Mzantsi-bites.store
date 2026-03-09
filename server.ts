import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import { User, UserRole, FoodItem, Order } from './types';

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccount) {
    try {
      const parsedAccount = JSON.parse(serviceAccount);
      console.log('[Firebase] Initializing with Service Account Key');
      admin.initializeApp({
        credential: admin.credential.cert(parsedAccount)
      });
    } catch (err) {
      console.error('[Firebase] Failed to parse FIREBASE_SERVICE_ACCOUNT:', err);
    }
  }

  if (!admin.apps.length) {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || 
                     process.env.GCP_PROJECT || 
                     process.env.VITE_FIREBASE_PROJECT_ID;
    
    if (projectId) {
      console.log('[Firebase] Initializing with Project ID:', projectId);
      admin.initializeApp({
        projectId: projectId
      });
    } else {
      console.log('[Firebase] Initializing with default credentials');
      admin.initializeApp();
    }
  }
}
const db = admin.firestore();

const app = express();
const PORT = 3000;
// Secure fallback for development - in production, always set JWT_SECRET in environment
const JWT_SECRET = process.env.JWT_SECRET || 'mzantsi-bites-v1-secure-fallback-key-2026-!@#$';

app.use(express.json());
app.use(cookieParser());

// API routes go here
app.get("/api/health", async (req, res) => {
  try {
    const snapshot = await db.collection('products').limit(1).get();
    res.json({ 
      status: "ok", 
      firestore: "connected",
      project: admin.app().options.projectId,
      count: snapshot.size
    });
  } catch (err) {
    res.status(500).json({ 
      status: "error", 
      firestore: "disconnected",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// In-memory stores
const checkoutSessions = new Map<string, any>();
const webhookEvents: any[] = [];

// Middleware to verify JWT
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware for role-based access
const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: UserRole; name: string };
    }
  }
}

// Auth Routes
app.post('/api/auth/firebase-sync', async (req, res) => {
  const { idToken, name, role } = req.body;
  if (!idToken) return res.status(400).json({ error: 'No token provided' });

  try {
    // Verify the ID token using firebase-admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user exists in Firestore
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    let userData: any;
    if (!userDoc.exists) {
      userData = {
        id: uid,
        email: decodedToken.email || '',
        name: name || decodedToken.name || 'User',
        role: role || 'customer',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await userRef.set(userData);
    } else {
      userData = { id: uid, ...userDoc.data() };
      // Optionally update name/role if provided and different
      if ((name && name !== userData.name) || (role && role !== userData.role)) {
        const updates: any = {};
        if (name) updates.name = name;
        if (role) updates.role = role;
        await userRef.update(updates);
        Object.assign(userData, updates);
      }
    }

    const tokenPayload = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json(userData);
  } catch (err) {
    console.error('Firebase sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json(req.user);
});

// Store Routes (Product Management)
app.post('/api/products', authenticate, authorize(['store', 'admin']), async (req, res) => {
  try {
    const product = { ...req.body, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    const docRef = await db.collection('products').add(product);
    res.json({ id: docRef.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt
      };
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.delete('/api/products/:id', authenticate, authorize(['store', 'admin']), async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Order Routes
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log('[Order] Creating order for user:', userId);
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID missing from token' });
    }

    const order = {
      ...req.body,
      customerId: userId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Ensure we don't have non-serializable data in the response
    const { createdAt, ...orderWithoutTimestamp } = order;

    const docRef = await db.collection('orders').add(order);
    console.log('[Order] Created successfully:', docRef.id);
    
    res.json({ 
      id: docRef.id, 
      ...orderWithoutTimestamp,
      createdAt: new Date().toISOString() // Return a string for the frontend
    });
  } catch (err) {
    console.error('[Order] Creation failed:', err);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      projectId: admin.app().options.projectId
    });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    let query: any = db.collection('orders');
    if (req.user!.role === 'customer') {
      query = query.where('customerId', '==', req.user!.id);
    } else if (req.user!.role === 'driver') {
      // Driver sees pending orders or orders assigned to them
      // Firestore doesn't support OR in simple queries easily, so we might need two queries or a different approach
      // For now, let's just return all for drivers and they can filter on frontend
    }
    
    const snapshot = await query.get();
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt
      };
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.patch('/api/orders/:id', authenticate, authorize(['store', 'driver', 'admin']), async (req, res) => {
  try {
    const { status, driverId } = req.body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (driverId) updateData.driverId = driverId;
    
    await db.collection('orders').doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delivery Routes
app.post('/api/deliveries', authenticate, authorize(['store', 'admin']), async (req, res) => {
  try {
    const delivery = {
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const docRef = await db.collection('deliveries').add(delivery);
    res.json({ id: docRef.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

app.get('/api/deliveries', authenticate, async (req, res) => {
  try {
    const snapshot = await db.collection('deliveries').get();
    const deliveries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt
      };
    });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

app.patch('/api/deliveries/:id', authenticate, authorize(['driver', 'admin']), async (req, res) => {
  try {
    await db.collection('deliveries').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery' });
  }
});

// Admin Routes
app.get('/api/admin/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt
      };
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Payment Routes
app.post('/api/payments/initiate', authenticate, async (req, res) => {
  const { orderId, amount, items, paymentMethod = 'ikhokha' } = req.body;
  
  if (!orderId || !amount) {
    return res.status(400).json({ error: 'Order ID and amount are required' });
  }

  try {
    const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    if (paymentMethod === 'paypal') {
      console.log(`[PayPal] Initiating for Order: ${orderId}, Amount: R${amount}`);
      
      // Simulate PayPal Checkout initiation
      // In a real app, you'd use the PayPal SDK or REST API
      const paymentSessionId = `paypal_${Math.random().toString(36).substring(2, 15)}`;
      const redirectUrl = `${baseUrl}/payment-success?orderId=${orderId}&session=${paymentSessionId}&method=paypal`;

      return res.json({ 
        success: true,
        redirectUrl,
        paymentSessionId
      });
    }

    // Default: iKhokha
    const keyId = process.env.PAYMENT_KEY_ID || 'IKVFQNM7GAS3P885GC16H1DJ9VLRHWEE';
    const keySecret = process.env.PAYMENT_KEY_SECRET || 'pZXyVmm7GjGJK7GkYl1GYJHQczlZ4ju';
    const storeId = process.env.PAYMENT_STORE_ID || 'mzantsi biteos.storei';

    console.log(`[iKhokha] Initiating for Order: ${orderId}, Amount: R${amount}`);
    
    // iKhokha Checkout API implementation
    // 1. Prepare the request payload
    const payload = {
      amount: Math.round(amount * 100), // amount in cents
      currency: 'ZAR',
      externalId: orderId,
      returnUrl: `${baseUrl}/payment-success?orderId=${orderId}`,
      cancelUrl: `${baseUrl}/?cancel=true`,
      callbackUrl: `${baseUrl}/api/payments/webhook`,
      description: `Order ${orderId} from Mzantsi Bites`,
    };

    // 2. In a real iKhokha integration, you would sign the payload or use Basic Auth
    // For this implementation, we'll simulate the API call to iKhokha
    // and return a simulated checkout URL if the keys are present.
    
    // Simulate API call to https://api.ikhokha.com/v1/checkout
    const response = await fetch('https://api.ikhokha.com/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keyId}:${keySecret}`, // Simulated auth header
      },
      body: JSON.stringify(payload)
    }).catch(() => ({ ok: false })); // Catch network errors for simulation

    if (response.ok) {
      const data = await (response as any).json();
      return res.json({ 
        success: true,
        redirectUrl: data.checkoutUrl,
        checkoutId: data.checkoutId
      });
    }

    // Fallback for simulation/development
    const paymentSessionId = `ikhokha_${Math.random().toString(36).substring(2, 15)}`;
    const redirectUrl = `${baseUrl}/payment-success?orderId=${orderId}&session=${paymentSessionId}`;

    res.json({ 
      success: true,
      redirectUrl,
      paymentSessionId
    });
  } catch (err) {
    console.error('Payment initiation failed:', err);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Existing Webhook and Checkout routes
app.post("/api/webhook", (req, res) => {
  const event = {
    id: `evt_${Math.random().toString(36).substring(2, 15)}`,
    receivedAt: new Date(),
    payload: req.body,
    headers: req.headers
  };

  console.log("Received Webhook Event:", JSON.stringify(event, null, 2));
  
  webhookEvents.unshift(event); // Add to start of array
  
  // Keep only the last 50 events
  if (webhookEvents.length > 50) {
    webhookEvents.pop();
  }

  res.status(200).json({ status: "received", eventId: event.id });
});

/**
 * Endpoint to retrieve recent webhook events (for debugging).
 */
app.get("/api/webhook-events", (req, res) => {
  res.json(webhookEvents);
});

/**
 * Endpoint for external apps to create a checkout session.
 * Payload should include items, total, etc.
 */
app.post("/api/checkout-session", (req, res) => {
  const { items, total, metadata } = req.body;
  
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid payload: 'items' array is required." });
  }

  const sessionId = `checkout_${Math.random().toString(36).substring(2, 15)}`;
  checkoutSessions.set(sessionId, { items, total, metadata, createdAt: new Date() });

  // Clean up old sessions (older than 1 hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [id, session] of checkoutSessions.entries()) {
    if (session.createdAt < oneHourAgo) {
      checkoutSessions.delete(id);
    }
  }

  const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  res.json({ 
    sessionId,
    checkoutUrl: `${baseUrl}/?session=${sessionId}`
  });
});

/**
 * Endpoint to retrieve a checkout session by ID.
 */
app.get("/api/checkout-session/:id", (req, res) => {
  const session = checkoutSessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: "Checkout session not found or expired." });
  }
  res.json(session);
});

// Fallback for API routes to ensure they always return JSON
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
