import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-973ebaac/health", (c) => {
  return c.json({ status: "ok" });
});

// --- EVENTS API ---

// 1. Get All Events
app.get("/make-server-973ebaac/events", async (c) => {
  try {
    // Prefix 'event:' olan tüm kayıtları getir
    const events = await kv.getByPrefix("event:");
    // Değerleri (value) bir diziye dönüştür
    const eventList = events.map((e) => e.value);
    return c.json(eventList);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 2. Create Event
app.post("/make-server-973ebaac/events", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID(); // Benzersiz ID oluştur
    const newEvent = { ...body, id, createdAt: new Date().toISOString() };
    
    // KV store'a kaydet (Anahtar: event:ID)
    await kv.set(`event:${id}`, newEvent);
    
    return c.json(newEvent, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 3. Update Event
app.put("/make-server-973ebaac/events/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    // Önce var mı diye kontrol et (opsiyonel ama iyi olur)
    const existing = await kv.get(`event:${id}`);
    if (!existing) {
      return c.json({ error: "Event not found" }, 404);
    }

    const updatedEvent = { ...existing, ...body };
    await kv.set(`event:${id}`, updatedEvent);
    
    return c.json(updatedEvent);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 4. Delete Event
app.delete("/make-server-973ebaac/events/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`event:${id}`);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);