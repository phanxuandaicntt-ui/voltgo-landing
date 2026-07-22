import type { Product } from "./types";
export const categories = [
  {name:"Nhà bếp",slug:"nha-bep",icon:"CookingPot",desc:"Nấu ăn nhanh, gọn và ngon hơn"},
  {name:"Vệ sinh",slug:"ve-sinh",icon:"Sparkles",desc:"Giữ nhà sạch mà không tốn sức"},
  {name:"Gia đình",slug:"gia-dinh",icon:"House",desc:"Tiện ích nhỏ, thay đổi lớn"},
  {name:"Thiết bị thông minh",slug:"thong-minh",icon:"Bot",desc:"Tự động hóa cuộc sống mỗi ngày"}
];
const img=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;
export const products: Product[] = [
 {id:"p1",slug:"noi-chien-khong-dau-smartcook-8l",name:"Nồi chiên không dầu SmartCook 8L",category:"Nhà bếp",categorySlug:"nha-bep",price:1890000,compareAt:2490000,image:img("photo-1585515320310-259814833e62"),description:"Nấu món ngon ít dầu với 10 chương trình tự động, cửa kính quan sát và lòng nồi chống dính.",rating:4.9,reviews:128,badge:"Bán chạy",specs:{"Dung tích":"8 lít","Công suất":"1800W","Bảo hành":"24 tháng"}},
 {id:"p2",slug:"may-hut-bui-cam-tay-flexi",name:"Máy hút bụi cầm tay Flexi Pro",category:"Vệ sinh",categorySlug:"ve-sinh",price:1290000,compareAt:1590000,image:img("photo-1558317374-067fb5f30001"),description:"Lực hút mạnh, thiết kế không dây siêu nhẹ, làm sạch mọi góc nhà trong vài phút.",rating:4.8,reviews:94,badge:"-19%",specs:{"Lực hút":"16.000Pa","Pin":"35 phút","Khối lượng":"1,2kg"}},
 {id:"p3",slug:"hop-bao-quan-chan-khong-6-mon",name:"Bộ hộp bảo quản chân không 6 món",category:"Nhà bếp",categorySlug:"nha-bep",price:459000,compareAt:590000,image:img("photo-1584473457493-17c4c24290c8"),description:"Giữ thực phẩm tươi lâu, xếp gọn tối ưu không gian tủ lạnh.",rating:4.7,reviews:76,badge:"Mới",specs:{"Chất liệu":"Tritan an toàn","Số lượng":"6 hộp","Bảo hành":"12 tháng"}},
 {id:"p4",slug:"robot-lau-kinh-cleango",name:"Robot lau kính CleanGo AI",category:"Thiết bị thông minh",categorySlug:"thong-minh",price:2790000,compareAt:3290000,image:img("photo-1581578731548-c64695cc6952"),description:"Nhận diện cạnh kính, tự lập lộ trình và làm sạch an toàn chỉ với một nút chạm.",rating:4.9,reviews:61,badge:"Thông minh",specs:{"Công suất":"90W","Dây an toàn":"4,5m","Bảo hành":"24 tháng"}},
 {id:"p5",slug:"ke-gia-vi-xoay-360",name:"Kệ gia vị xoay 360°",category:"Gia đình",categorySlug:"gia-dinh",price:329000,image:img("photo-1556911220-bff31c812dba"),description:"Sắp xếp gia vị gọn đẹp, lấy nhanh bằng một thao tác.",rating:4.6,reviews:143,specs:{"Chất liệu":"Thép sơn tĩnh điện","Đường kính":"28cm","Tải trọng":"8kg"}},
 {id:"p6",slug:"cay-lau-nha-tu-vat",name:"Cây lau nhà tự vắt EasyMop",category:"Vệ sinh",categorySlug:"ve-sinh",price:389000,compareAt:490000,image:img("photo-1527515637462-cff94eecc1ac"),description:"Tự giặt, tự vắt, không cần chạm tay vào nước bẩn.",rating:4.8,reviews:207,badge:"Yêu thích",specs:{"Thùng":"2 ngăn","Cán":"Inox 304","Bông lau":"Microfiber"}},
 {id:"p7",slug:"may-xay-da-nang-minimix",name:"Máy xay đa năng MiniMix",category:"Nhà bếp",categorySlug:"nha-bep",price:699000,image:img("photo-1570222094114-d054a817e56b"),description:"Xay thịt, rau củ và gia vị nhanh chóng với cối thủy tinh bền chắc.",rating:4.7,reviews:88,badge:"Mới",specs:{"Công suất":"400W","Dung tích":"2 lít","Lưỡi dao":"Inox 6 cánh"}},
 {id:"p8",slug:"thung-rac-cam-bien-12l",name:"Thùng rác cảm biến 12L",category:"Thiết bị thông minh",categorySlug:"thong-minh",price:549000,compareAt:690000,image:img("photo-1532996122724-e3c354a0b15b"),description:"Mở nắp không chạm, khử mùi và đóng êm cho không gian sạch sẽ.",rating:4.6,reviews:52,specs:{"Dung tích":"12 lít","Cảm biến":"Hồng ngoại","Pin":"2 x AA"}}
];
export const money=(n:number)=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n);
export const getProduct=(slug:string)=>products.find(p=>p.slug===slug);
