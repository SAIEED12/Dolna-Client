"use client";
import { Package } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextArea,
  TextField,
} from "@heroui/react";
import { addProduct } from "@/lib/actions/products";
import { useState } from "react";
import { imageUpload } from "@/lib/imageUpload";

export function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const data = Object.fromEntries(formdata.entries());

    const imageFile = await imageUpload(data.image);

    const result = await addProduct({ ...data, image: imageFile.url });
    console.log(result);

    
  };
  return (
    <Modal>
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        Add Product
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <Package className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Add a product</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Enter the product details below to add it to your catalog.
              </p>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Surface variant="default">
                <form
                  id="add-product-form"
                  onSubmit={onSubmit}
                  className="flex flex-col gap-4"
                >
                  <TextField
                    className="w-full"
                    name="name"
                    isRequired
                    variant="secondary"
                  >
                    <Label>Name</Label>
                    <Input placeholder="e.g. Handwoven Jute Basket" />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="description"
                    isRequired
                    variant="secondary"
                  >
                    <Label>Description</Label>
                    <TextArea placeholder="Describe the product" rows={3} />
                  </TextField>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="product-image">Image</Label>
                    <input
                      id="product-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full cursor-pointer rounded-lg border border-dashed border-muted/40 p-2 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-soft-foreground"
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Product preview"
                        className="mt-1 h-32 w-32 rounded-lg object-cover"
                      />
                    )}
                  </div>

                  <TextField
                    className="w-full"
                    name="materials"
                    variant="secondary"
                  >
                    <Label>Materials</Label>
                    <Input placeholder="e.g. Jute, Cotton, Bamboo (comma separated)" />
                  </TextField>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      className="w-full"
                      name="price"
                      type="number"
                      isRequired
                      variant="secondary"
                    >
                      <Label>Price</Label>
                      <Input placeholder="0.00" min="0" step="0.01" />
                    </TextField>

                    <TextField
                      className="w-full"
                      name="stock"
                      type="number"
                      isRequired
                      variant="secondary"
                    >
                      <Label>Stock</Label>
                      <Input placeholder="0" min="0" step="1" />
                    </TextField>
                  </div>

                  {error && <p className="text-sm text-danger">{error}</p>}
                </form>
              </Surface>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => setIsOpen(false)}
                isDisabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-product-form"
                isPending={isPending}
              >
                Add Product
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
