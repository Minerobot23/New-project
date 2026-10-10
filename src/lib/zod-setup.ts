import { z } from "zod";

// Zod otherwise probes `new Function` when it builds an object schema (caught, then it falls back). Under the
// Content Security Policy that probe is reported as a violation. Jitless mode skips it; validation is the same.
// Import this before any module that builds schemas used in the browser.
z.config({ jitless: true });
