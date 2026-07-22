# Kiến trúc — Siêu Thị Gia Dụng

## 1. Requirement analysis

Mục tiêu chính là giảm thời gian tìm và mua sản phẩm gia dụng cho gia đình trẻ. Luồng ưu tiên: khám phá → lọc/tìm → đánh giá PDP → thêm giỏ → checkout QR → theo dõi đơn. Vai trò gồm khách vãng lai, khách hàng, nhân viên và admin. Yêu cầu phi chức năng: WCAG AA, mobile-first, SEO indexable, webhook idempotent, không lộ secret và Core Web Vitals tốt.

Tiêu chí hoàn thành MVP production: storefront đa trang, cart bền vững trên trình duyệt, đơn được validate và lưu server-side, callback SePay cập nhật thanh toán, khu vực tài khoản/admin, metadata/schema/sitemap/robots và build sạch.

## 2. Information architecture

- Storefront: `/`, `/san-pham`, `/san-pham/[slug]`, `/gio-hang`, `/thanh-toan`.
- Identity: `/dang-nhap`, `/dang-ky`, `/tai-khoan`.
- Operations: `/admin`, API order và webhook thanh toán.
- Taxonomy: Nhà bếp, Vệ sinh, Gia đình, Thiết bị thông minh; product có tags/specs để mở rộng filter.

## 3. Database design

Prisma schema chuẩn hóa User–Address, Category–Product, Order–OrderItem, Voucher và Review. Mọi bảng nghiệp vụ có timestamps; entity quản trị hỗ trợ `deletedAt`; index bám theo truy vấn catalog, trạng thái đơn, lịch sử người dùng và moderation. Supabase migration tối thiểu dùng RLS deny-by-default, chỉ service role được ghi đơn.

## 4. Design system

- Brand green `#087f5b`, dark `#065f46`; accent orange `#f97316`; neutral ink `#15362f`.
- Inter/system sans, radius 12–20px, shadow xanh rất nhẹ, spacing nền 4px.
- Primitive: button, field, pill, card, product card; trạng thái focus rõ, hit target tối thiểu 44px.
- Copy thân thiện, thực tế, ưu tiên lợi ích “nhẹ việc nhà” thay vì phóng đại tính năng.

## 5. Folder structure & clean architecture

`app/` định tuyến và server boundary; `components/` UI tái sử dụng; `context/` state client; `lib/` domain data, validation, env, rate limit; `prisma/` domain schema; `supabase/` migration. Adapter dịch vụ ngoài đặt sau API route để token không đi xuống client.

## 6–10. Implementation decisions

Server Components là mặc định; client component chỉ dùng cho cart/form tương tác. Catalog hiện có seed nội bộ để storefront luôn render, API orders tùy chọn persist sang Supabase khi đủ env. Auth UI và role model đã sẵn sàng; bước kết nối Supabase Auth production cần redirect URL/domain thật. SePay dùng order code duy nhất trong nội dung chuyển khoản, webhook xác thực secret và cập nhật bằng service role. Admin hiện là operational shell; production phải bảo vệ route bằng session/role middleware trước khi cấp tài khoản nhân viên.

## 11. SEO, performance, security

Metadata template, canonical, Open Graph, JSON-LD Store/Product, sitemap và robots đã có. Ảnh qua Next Image, font hệ thống tránh render-blocking. Zod kiểm tra input, rate limit API, constant-time compare webhook, headers bảo mật và RLS deny-by-default. Rate limiter in-memory cần thay bằng Redis/Upstash ở quy mô multi-instance.

## 12. Test & deploy checklist

Chạy typecheck/lint/test/build; kiểm tra keyboard và breakpoint 360/768/1440; migrate Supabase; thêm env Vercel; đăng ký webhook SePay; thử đơn giá trị nhỏ; xác minh email; khóa `/admin`; chạy Lighthouse; gắn domain, Search Console và giám sát lỗi.
