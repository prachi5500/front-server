const CLOUDINARY_CLOUD_NAME =  process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET; 

export const uploadToCloudinary = async (file: File | Blob, fileName: string = 'card'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'business_cards');
  formData.append('public_id', `${fileName}_${Date.now()}`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Generate Cloudinary URL with transformations
export const getOptimizedImageUrl = (url: string, width: number = 400, height: number = 228) => {
  if (!url.includes('cloudinary.com')) return url;
  
  // Transform URL for optimized display
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  const transformations = `c_fill,w_${width},h_${height},q_auto,f_auto`;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};