export const imageUpload = async (image) =>{
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`, {
        method: "POST",
        body: formData,
    })

    if (!res.ok) {
        throw new Error(`Image upload failed: ${res.status}`);
    }

    const data = await res.json();
    if (!data?.data?.url) {
        throw new Error("Image upload failed: missing URL");
    }
    return data.data;
}