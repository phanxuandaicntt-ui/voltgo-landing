# Siêu Thị Gia Dụng

Website thương mại điện tử mobile-first cho đồ gia dụng tiện ích, xây dựng với Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma và Supabase.

## Khởi chạy

```bash
pnpm install
copy .env.example .env.local
pnpm dev
```

## Kiểm tra production

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Không commit token. Cấu hình Supabase, SePay, Resend và auth qua biến môi trường trên Vercel. Chạy `supabase/migrations/0001_init.sql` bằng Supabase SQL Editor trước khi nhận đơn thật.

Tài liệu kiến trúc và quyết định thiết kế nằm tại `docs/architecture.md`.
