import { Table } from "@heroui/react";
import Image from "next/image";

export function ProductTable({ products }) {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Products" className="min-w-[700px]">
          <Table.Header>
            <Table.Column isRowHeader>Image</Table.Column>
            <Table.Column>Name</Table.Column>
            <Table.Column>Category</Table.Column>
            <Table.Column>Materials</Table.Column>
            <Table.Column>Price</Table.Column>
            <Table.Column>Stock</Table.Column>
          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <Table.Row key={String(product._id)}>
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
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>
                  {Array.isArray(product.materials)
                    ? product.materials.join(", ")
                    : product.materials}
                </Table.Cell>
                <Table.Cell>৳{Number(product.price).toLocaleString()}</Table.Cell>
                <Table.Cell>{product.stock}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}