import { z } from "zod";
export const orderSchema=z.object({
  fullName:z.string().trim().min(2).max(100), phone:z.string().regex(/^(0|\+84)[0-9]{9,10}$/),
  email:z.string().email().optional().or(z.literal("")), address:z.string().trim().min(8).max(300),
  note:z.string().max(500).optional(), voucher:z.string().max(30).optional(),
  items:z.array(z.object({productId:z.string(),quantity:z.number().int().min(1).max(20)})).min(1)
});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(8).max(100)});
