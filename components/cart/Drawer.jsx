// components/cart/Drawer.jsx
'use client';

import { Button, Drawer } from "@heroui/react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartDrawer({ cartCount = 0, items = [], compact = false }) {
  const router = useRouter();
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <Drawer>
      {/* Trigger navbar cart button */}
      {compact ? (
        <Button
          variant="ghost"
          aria-label={`Open cart, ${cartCount} items`}
          className="flex h-auto min-w-0 items-center gap-1 rounded-full border border-ink px-3 py-2 text-ink hover:bg-ink hover:text-white"
        >
          <ShoppingBag size={18} strokeWidth={1.75} />
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
            {cartCount}
          </span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="flex h-auto min-w-0 items-center gap-2 rounded-full border border-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
        >
          <ShoppingBag size={16} strokeWidth={1.75} />
          CART
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
            {cartCount}
          </span>
        </Button>
      )}

      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>Your Cart ({cartCount})</Drawer.Heading>
            </Drawer.Header>

            <Drawer.Body>
              {items.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>${item.qty * item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Drawer.Body>

            <Drawer.Footer>
              <div className="flex w-full items-center justify-between">
                <span className="font-semibold">Total: ${total}</span>
                <div className="flex gap-2">
                  <Button
                    slot="close"
                    variant="secondary"
                    className="cursor-pointer rounded-full border border-[#E5E5E5] bg-transparent px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#1A1A1A] transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
                  >
                    Close
                  </Button>
                  <Button
                    slot="close"
                    onPress={() => router.push("/checkout")}
                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white no-underline transition-colors outline-none hover:bg-brand-dark"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}