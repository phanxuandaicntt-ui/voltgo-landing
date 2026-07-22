import { z } from "zod";
const schema=z.object({NEXT_PUBLIC_SITE_URL:z.string().url().default("http://localhost:3000"),DATABASE_URL:z.string().optional(),AUTH_SECRET:z.string().min(32).optional(),SEPAY_WEBHOOK_SECRET:z.string().optional()});
export const env=schema.parse({NEXT_PUBLIC_SITE_URL:process.env.NEXT_PUBLIC_SITE_URL,DATABASE_URL:process.env.DATABASE_URL,AUTH_SECRET:process.env.AUTH_SECRET,SEPAY_WEBHOOK_SECRET:process.env.SEPAY_WEBHOOK_SECRET});
