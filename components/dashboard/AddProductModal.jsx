"use client";
import { Package, Plus, X } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
} from "@heroui/react";
import { addProduct } from "@/lib/actions/products";
import { useState } from "react";
import { imageUpload } from "@/lib/imageUpload";

const inputClassName =
  "w-full rounded-xl border border-[#D8CBB4] bg-white px-4 py-3 text-sm text-[#2B1C14] placeholder:text-[#A69783] outline-none focus:border-[#9C4E30] focus:ring-2 focus:ring-[#9C4E30]/20";
const labelClassName = "text-sm font-medium text-[#2B1C14]";

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

  const handleRemovePreview = (e) => {
    e.preventDefault();
    const input = document.getElementById("product-image");
    if (input) input.value = "";
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      const form = e.currentTarget;
      const formdata = new FormData(form);
      const data = Object.fromEntries(formdata.entries());
      console.log("Form data:", data);

      const imageFile = data.image;
      const hasImage = imageFile instanceof File && imageFile.size > 0;

      let imageUrl = "";
      if (hasImage) {
        const uploaded = await imageUpload(imageFile);
        imageUrl = uploaded?.url ?? "";
      }

      await addProduct({ ...data, image: imageUrl });

      form.reset();
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setIsOpen(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal>
      <Button
        onPress={() => setIsOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#F5F1E8] transition-colors hover:bg-[#C1633C]"
      >
        <Plus size={15} strokeWidth={2} />
        ADD PRODUCT
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        className="bg-black/40 backdrop-blur-sm"
      >
        <Modal.Container placement="auto">
          <Modal.Dialog className="max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E4DDCF]/70 bg-[#F5F1E8] shadow-xl shadow-black/10 sm:max-w-lg">
            <Modal.CloseTrigger className="rounded-full text-[#7A6F63] transition-colors hover:bg-[#E4DDCF]/60 hover:text-[#1A1A1A]" />

            <Modal.Header className="border-b border-[#E4DDCF]/70 px-6 py-5">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-[#C1633C] uppercase">
                New listing
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Modal.Icon className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-[#E8A87C]">
                  <Package className="size-5" strokeWidth={1.75} />
                </Modal.Icon>
                <Modal.Heading className="font-serif text-2xl text-[#1A1A1A]">
                  Add a product
                </Modal.Heading>
              </div>
              <p className="mt-2 text-sm leading-5 text-[#7A6F63]">
                Enter the product details below to add it to your catalog.
              </p>
            </Modal.Header>

            <Modal.Body className="bg-[#F5F1E8] px-6 py-5">
              <form
                id="add-product-form"
                onSubmit={onSubmit}
                className="flex flex-col gap-5"
              >
                <TextField
                  className="flex w-full flex-col gap-1.5"
                  name="name"
                  isRequired
                >
                  <Label className={labelClassName}>Name</Label>
                  <Input
                    placeholder="e.g. Handwoven Jute Basket"
                    className={inputClassName}
                  />
                </TextField>

                <TextField
                  className="flex w-full flex-col gap-1.5"
                  name="description"
                  isRequired
                >
                  <Label className={labelClassName}>Description</Label>
                  <TextArea
                    placeholder="Describe the product"
                    rows={3}
                    className={`${inputClassName} min-h-24 resize-y`}
                  />
                </TextField>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="product-image" className={labelClassName}>
                    Image
                  </Label>
                  <input
                    id="product-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="block w-full cursor-pointer rounded-xl border border-dashed border-[#D8CBB4] bg-white/60 p-2 text-sm text-[#2B1C14] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#1A1A1A] file:px-4 file:py-2 file:text-xs file:font-semibold file:tracking-[0.1em] file:text-[#F5F1E8] file:transition-colors hover:file:bg-[#C1633C]"
                  />
                  {preview && (
                    <div className="mt-2 rounded-xl border border-[#E4DDCF] bg-white p-2">
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Product preview"
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePreview}
                          aria-label="Remove image"
                          className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-[#C1633C]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <TextField
                  className="flex w-full flex-col gap-1.5"
                  name="materials"
                >
                  <Label className={labelClassName}>Materials</Label>
                  <Input
                    placeholder="e.g. Jute, Cotton, Bamboo (comma separated)"
                    className={inputClassName}
                    isRequired
                  />
                </TextField>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="product-category">Category</Label>
                  <select
                    id="product-category"
                    name="category"
                    required
                    defaultValue=""
                    className="block w-full cursor-pointer rounded-xl border border-[#D8CBB4] bg-white/60 px-3 py-3.5 text-base text-[#2B1C14] transition-colors invalid:text-[#9A8F85] focus:border-[#C1633C] focus:outline-none focus:ring-2 focus:ring-[#C1633C]/20 [&>option]:text-[#2B1C14]"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="baskets">Baskets</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bags">Bags</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField
                    className="flex w-full flex-col gap-1.5"
                    name="price"
                    type="number"
                    isRequired
                  >
                    <Label className={labelClassName}>Price (৳)</Label>
                    <Input
                      placeholder="e.g. 12,500"
                      min="0"
                      step="1"
                      className={inputClassName}
                    />
                  </TextField>

                  <TextField
                    className="flex w-full flex-col gap-1.5"
                    name="stock"
                    type="number"
                    isRequired
                  >
                    <Label className={labelClassName}>Stock</Label>
                    <Input
                      placeholder="0"
                      min="0"
                      step="1"
                      className={inputClassName}
                    />
                  </TextField>
                </div>

                {error && (
                  <p className="text-sm text-[#B3261E]" role="alert">
                    {error}
                  </p>
                )}
              </form>
            </Modal.Body>

            <Modal.Footer className="border-t border-[#E4DDCF]/70 bg-[#EFE7D8]/50 px-6 py-4">
              <Button
                onPress={() => setIsOpen(false)}
                isDisabled={isPending}
                className="cursor-pointer rounded-full border border-[#D8CBB4] bg-transparent px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#2B1C14] transition-colors hover:border-[#C1633C] hover:bg-[#C1633C]/10 hover:text-[#C1633C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                form="add-product-form"
                isPending={isPending}
                className="cursor-pointer rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#F5F1E8] transition-colors hover:bg-[#C1633C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "ADDING…" : "ADD PRODUCT"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
