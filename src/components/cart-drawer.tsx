"use client";

import { useCart } from "@/lib/commerce";
import Link from "next/link";
import Image from "next/image";
import {
  CartCheckoutButton,
  CartCost,
  CartLineProvider,
  CartLineQuantity,
  Money,
} from "@/lib/commerce";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Separator } from "@esmate/shadcn/components/ui/separator";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { ShoppingBag, X } from "@esmate/shadcn/pkgs/lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const cart = useCart();
  const isCartEmpty = (cart?.totalQuantity ?? 0) === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[60] flex h-full w-[85%] max-w-xs flex-col border-l border-[#C6A24A]/20 bg-white/95 shadow-xl sm:w-full sm:max-w-md"
          >
             <div className="flex items-center justify-between border-b border-[#C6A24A]/15 bg-[#F6F1E7]/80 px-3 py-3 sm:px-5 sm:py-4">
               <div className="flex items-center gap-2">
                 <ShoppingBag className="h-4 w-4 text-[#1F6B4F] sm:h-5 sm:w-5" />
                 <h2 className="text-lg font-semibold text-[#1E1F1C] sm:text-xl">Your Cart</h2>
               </div>
               <Badge className="rounded-full bg-[#1F6B4F] px-2 py-0.5 text-[10px] font-medium text-[#F6F1E7] sm:px-3 sm:py-1 sm:text-xs">
                 {cart?.totalQuantity ?? 0} {(cart?.totalQuantity ?? 0) !== 1 ? "items" : "item"}
               </Badge>
               <button
                 onClick={() => onOpenChange(false)}
                 className="rounded-full p-1.5 text-[#5A5E55] hover:bg-[#C6A24A]/10 sm:p-2"
               >
                 <X className="h-4 w-4 sm:h-5 sm:w-5" />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5">
              {isCartEmpty ? (
                 <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <ShoppingBag className="h-12 w-12 text-[#C6A24A]/30 mb-3 sm:h-16 sm:w-16" />
                   <p className="text-base font-medium text-[#1E1F1C] sm:text-lg">Your cart is empty</p>
                   <p className="text-xs text-[#5A5E55] mt-1 sm:text-sm">Add some items to get started</p>
                   <Button
                     asChild
                     className="mt-4 rounded-full bg-[#1F6B4F] px-4 text-[#F6F1E7] hover:bg-[#17513D] sm:mt-6 sm:px-6"
                     onClick={() => onOpenChange(false)}
                   >
                     <Link href="/products">Start Shopping</Link>
                   </Button>
                 </div>
               ) : (
                 <div className="space-y-3 sm:space-y-5">
                   {cart.lines?.map((line) => (
                    <CartLineProvider key={line?.id} line={line!}>
                         <div className="space-y-2 sm:space-y-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                           <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F6F1E7] ring-1 ring-[#C6A24A]/20 sm:h-20 sm:w-20 sm:rounded-xl">
                            <Image
                              src={line?.merchandise?.image?.url as string}
                              alt={line?.merchandise?.image?.altText || ""}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                               <Link
                                 href={`/products/${line?.merchandise?.product?.handle}`}
                                 onClick={() => onOpenChange(false)}
                                 className="line-clamp-2 text-xs font-semibold leading-4 text-[#1E1F1C] transition hover:text-[#1F6B4F] sm:text-sm sm:leading-5"
                               >
                                 {line?.merchandise?.product?.title}
                               </Link>
                              <button
                                onClick={() => line?.id && cart.removeLine(line.id)}
                                className="shrink-0 p-1 text-[#5A5E55] hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                             <div className="flex flex-wrap gap-1">
                               {line?.merchandise?.selectedOptions?.map((option) => (
                                 <Badge
                                   key={option?.name}
                                   variant="secondary"
                                   className="rounded-full border border-[#C6A24A]/20 bg-[#F6F1E7] px-1.5 py-0 text-[9px] font-medium text-[#1E1F1C] sm:px-2 sm:py-0.5 sm:text-[10px]"
                                 >
                                   {option?.value}
                                 </Badge>
                               ))}
                             </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                  onClick={() => line?.id && cart.updateQuantity(line.id, line.quantity - 1)}
                                  className="h-5 w-5 rounded-full border border-[#C6A24A]/25 flex items-center justify-center text-[#5A5E55] hover:bg-[#F6F1E7] text-[10px] sm:h-6 sm:w-6 sm:text-xs"
                                >
                                  -
                                </button>
                                <span className="min-w-[20px] text-center text-xs font-medium sm:min-w-[24px] sm:text-sm">
                                  <CartLineQuantity />
                                </span>
                                <button
                                  onClick={() => line?.id && cart.updateQuantity(line.id, line.quantity + 1)}
                                  className="h-5 w-5 rounded-full border border-[#C6A24A]/25 flex items-center justify-center text-[#5A5E55] hover:bg-[#F6F1E7] text-[10px] sm:h-6 sm:w-6 sm:text-xs"
                                >
                                  +
                                </button>
                              </div>

                              <Money
                                data={line?.cost?.totalAmount}
                                className="shrink-0 text-xs font-semibold text-[#1E1F1C] sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>

                         <Separator className="bg-[#C6A24A]/15 my-1 sm:my-0" />
                      </div>
                    </CartLineProvider>
                  ))}
                </div>
              )}
            </div>

            {!isCartEmpty && (
              <div className="border-t border-[#C6A24A]/15 bg-white px-3 pb-20 pt-5 lg:px-5 lg:pb-5">
                 <div className="space-y-2 sm:space-y-3">
                   <div className="flex items-center justify-between text-xs font-medium text-[#1E1F1C] sm:text-sm">
                     <span>Subtotal</span>
                     <CartCost amountType="subtotal" />
                   </div>

                   <p className="text-[10px] leading-4 text-[#5A5E55] sm:text-xs sm:leading-5">
                     Shipping and taxes calculated at checkout
                   </p>

                   <div className="flex gap-1.5 sm:gap-2">
                     <CartCheckoutButton
                       className="flex-1 inline-flex h-8 items-center justify-center rounded-full bg-[#1F6B4F] text-xs font-semibold text-[#F6F1E7] transition hover:bg-[#17513D] sm:h-10 sm:text-sm"
                     >
                       Proceed to Checkout
                     </CartCheckoutButton>

                     <Button
                       variant="outline"
                       className="flex-1 h-8 rounded-full border-[#C6A24A]/25 text-xs font-medium text-[#1E1F1C] hover:bg-[#F6F1E7] sm:h-10 sm:text-sm"
                       onClick={() => onOpenChange(false)}
                     >
                       Continue Shopping
                     </Button>
                   </div>
                 </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}