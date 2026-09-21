"use client";
import { Table } from "@heroui/react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { UpdateProductModal } from "./UpdateProductModal";

const iconButtonClassName =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#525252] transition-colors outline-none hover:bg-brand-soft hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40";

export function ProductTable({ products }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Products" className="min-w-[760px]">
            <Table.Header>
              <Table.Column isRowHeader>Image</Table.Column>
              <Table.Column>Name</Table.Column>
              <Table.Column>Price</Table.Column>
              <Table.Column>Stock</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {products.map((product) => {
                const id = String(product._id);
                return (
                  <Table.Row key={id}>
                    <Table.Cell>
                      <Image
                        height={40}
                        width={40}
                        unoptimized
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>
                      ৳{Number(product.price).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>{product.stock}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/products/${id}`}
                          aria-label={`View ${product.name}`}
                          title="View"
                          className={iconButtonClassName}
                        >
                          <Eye size={16} strokeWidth={1.75} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          aria-label={`Update ${product.name}`}
                          title="Update"
                          className={iconButtonClassName}
                        >
                          <Pencil size={16} strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(product)}
                          aria-label={`Delete ${product.name}`}
                          title="Delete"
                          className={`${iconButtonClassName} hover:bg-red-50 hover:text-brand`}
                        >
                          <Trash2 size={16} strokeWidth={1.75} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <UpdateProductModal
        product={editingProduct}
        isOpen={editingProduct !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
      />
      <DeleteConfirmModal
        product={deletingProduct}
        isOpen={deletingProduct !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null);
        }}
      />
    </>
  );
}
