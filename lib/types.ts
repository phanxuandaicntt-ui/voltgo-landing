export type Product = { id:string; slug:string; name:string; category:string; categorySlug:string; price:number; compareAt?:number; image:string; description:string; rating:number; reviews:number; badge?:string; specs:Record<string,string> };
export type CartItem = { product: Product; quantity:number };
