"use client";
import { createContext,useContext,useEffect,useMemo,useState } from "react";
import type { CartItem,Product } from "@/lib/types";
type Cart={items:CartItem[];count:number;subtotal:number;add:(p:Product,q?:number)=>void;remove:(id:string)=>void;setQty:(id:string,q:number)=>void;clear:()=>void};
const C=createContext<Cart|null>(null);
export function CartProvider({children}:{children:React.ReactNode}){const [items,setItems]=useState<CartItem[]>([]);useEffect(()=>{queueMicrotask(()=>{try{setItems(JSON.parse(localStorage.getItem("stgd-cart")||"[]"))}catch{}})},[]);useEffect(()=>{localStorage.setItem("stgd-cart",JSON.stringify(items))},[items]);const value=useMemo(()=>({items,count:items.reduce((s,i)=>s+i.quantity,0),subtotal:items.reduce((s,i)=>s+i.product.price*i.quantity,0),add:(p:Product,q=1)=>setItems(a=>a.some(i=>i.product.id===p.id)?a.map(i=>i.product.id===p.id?{...i,quantity:Math.min(20,i.quantity+q)}:i):[...a,{product:p,quantity:q}]),remove:(id:string)=>setItems(a=>a.filter(i=>i.product.id!==id)),setQty:(id:string,q:number)=>setItems(a=>a.map(i=>i.product.id===id?{...i,quantity:Math.max(1,Math.min(20,q))}:i)),clear:()=>setItems([])}),[items]);return <C.Provider value={value}>{children}</C.Provider>}
export const useCart=()=>{const c=useContext(C);if(!c)throw new Error("useCart must be inside CartProvider");return c};
