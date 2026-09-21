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
import { useEffect, useRef, useState } from "react";
import { imageUpload } from "@/lib/imageUpload";

const MAX_IMAGES = 4;

const inputClassName =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#8A8A8A] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClassName = "text-sm font-medium text-[#1A1A1A]";

const fileKey = (f) => `${f.name}-${f.size}-${f.lastModified}`;

export function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]); // File[] (max 4)
  const [previews, setPreviews] = useState([]); // object URLs, same order as files

  const inputRef = useRef(null);
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  useEffect(() => {
    return () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const syncInput = (list) => {
    const input = inputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    list.forEach((f) => dt.items.add(f));
    input.files = dt.files;
  };

  const applyFiles = (nextFiles) => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles(nextFiles);
    setPreviews(nextFiles.map((f) => URL.createObjectURL(f)));
    syncInput(nextFiles);
  };

  const resetImages = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    syncInput([]);
  };

  const handleImageChange = (e) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) {
      syncInput(files);
      return;
    }

    const existing = new Set(files.map(fileKey));
    const fresh = picked.filter((f) => !existing.has(fileKey(f)));
    const merged = [...files, ...fresh];

    setError(
      merged.length > MAX_IMAGES
        ? `You can upload a maximum of ${MAX_IMAGES} images. Extra files were ignored.`
        : null,
    );
    applyFiles(merged.slice(0, MAX_IMAGES));
  };

  const handleRemoveImage = (index) => {
    setError(null);
    applyFiles(files.filter((_, i) => i !== index));
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
      resetImages();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const imageFiles = formdata
      .getAll("images")
      .filter((f) => f instanceof File && f.size > 0);

    if (imageFiles.length < 1) {
      setError("Select at least 1 image.");
      return;
    }
    if (imageFiles.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    setIsPending(true);
    try {
      
      let urls;
      try {
        const uploaded = await Promise.all(
          imageFiles.map((file) => imageUpload(file)),
        );
        urls = uploaded.map((u) => u?.url ?? "");
        if (urls.some((url) => !url)) throw new Error("Missing image URL");
      } catch (err) {
        console.error("Image upload failed:", err);
        setError("Image upload failed. Please try again.");
        return;
      }

      
      try {
        await addProduct({ ...data, image: urls[0], images: urls });
      } catch (err) {
        console.error("Add product failed:", err);
        setError("Couldn't save the product. Please try again.");
        return;
      }

      form.reset();
      resetImages();
      setIsOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  const isFull = previews.length >= MAX_IMAGES;

  return (
    <Modal>
      <Button
        onPress={() => setIsOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white transition-colors hover:bg-brand"
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
          <Modal.Dialog className="max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white shadow-xl shadow-black/10 sm:max-w-lg">
            <Modal.CloseTrigger className="rounded-full text-[#8A8A8A] transition-colors hover:bg-[#F5F5F5] hover:text-[#1A1A1A]" />

            <Modal.Header className="border-b border-[#E5E5E5] px-6 py-5">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-brand uppercase">
                New listing
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Modal.Icon className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Package className="size-5" strokeWidth={1.75} />
                </Modal.Icon>
                <Modal.Heading className="font-serif text-2xl text-[#1A1A1A]">
                  Add a product
                </Modal.Heading>
              </div>
              <p className="mt-2 text-sm leading-5 text-[#525252]">
                Enter the product details below to add it to your catalog.
              </p>
            </Modal.Header>

            <Modal.Body className="bg-white px-6 py-5">
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
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor="product-image" className={labelClassName}>
                      Images
                    </Label>
                    <span className="text-xs text-[#8A8A8A]">
                      Up to {MAX_IMAGES} · {previews.length}/{MAX_IMAGES}{" "}
                      selected
                    </span>
                  </div>
                  
                  <input
                    ref={inputRef}
                    id="product-image"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    tabIndex={isFull ? -1 : 0}
                    aria-disabled={isFull}
                    onChange={handleImageChange}
                    className={`block w-full cursor-pointer rounded-xl border border-dashed border-[#E5E5E5] bg-white p-2 text-sm text-[#1A1A1A] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#1A1A1A] file:px-4 file:py-2 file:text-xs file:font-semibold file:tracking-[0.1em] file:text-white file:transition-colors hover:file:bg-brand ${
                      isFull ? "pointer-events-none opacity-60" : ""
                    }`}
                  />
                  <p className="text-xs text-[#8A8A8A]">
                    {isFull
                      ? "Maximum reached. Remove an image to add another."
                      : "The first image is used as the cover."}
                  </p>

                  {previews.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-[#E5E5E5] bg-white p-2">
                      {previews.map((src, index) => (
                        <div key={src} className="relative">
                          <img
                            src={src}
                            alt={`Product preview ${index + 1}`}
                            className="h-28 w-full rounded-lg object-cover"
                          />
                          {index === 0 && (
                            <span className="absolute top-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            disabled={isPending}
                            aria-label={`Remove image ${index + 1}`}
                            className="absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <TextField
                  className="flex w-full flex-col gap-1.5"
                  name="materials"
                  isRequired
                >
                  <Label className={labelClassName}>Materials</Label>
                  <Input
                    placeholder="e.g. Jute, Cotton, Bamboo (comma separated)"
                    className={inputClassName}
                  />
                </TextField>

                <div className="flex flex-col gap-2">
                  <TextField className="flex w-full flex-col gap-1.5"
                  name="category"
                  isRequired>
                  <Label className={labelClassName}>Category</Label>
                    <Input
                      placeholder="e.g. Baskets, Home Decor, Hanging Swing Chairs etc."
                      className={inputClassName}
                      
                    />
                  </TextField>
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
                  <p className="text-sm text-brand" role="alert">
                    {error}
                  </p>
                )}
              </form>
            </Modal.Body>

            <Modal.Footer className="border-t border-[#E5E5E5] bg-[#FAFAFA] px-6 py-4">
              <Button
                onPress={() => handleOpenChange(false)}
                isDisabled={isPending}
                className="cursor-pointer rounded-full border border-[#E5E5E5] bg-transparent px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#1A1A1A] transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                form="add-product-form"
                isPending={isPending}
                className="cursor-pointer rounded-full bg-brand px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
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