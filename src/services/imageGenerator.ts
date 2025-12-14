import html2canvas from 'html2canvas';

export const generateCardImage = async (elementId: string, scale: number = 2): Promise<string> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    // Ensure element is visible
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.opacity = '1';

    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.clientWidth,
      height: element.clientHeight,
    });

    // Return data URL
    return canvas.toDataURL('image/png', 1.0);
    
  } catch (error) {
    console.error('Error generating card image:', error);
    throw error;
  }
};

// For production, you can also add Cloudinary upload
export const uploadToCloudinary = async (dataUrl: string, folder: string = 'cart_items'): Promise<string> => {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', 'business_cards');
    formData.append('folder', folder);
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Cloudinary upload failed');
    }
    
    const data = await uploadResponse.json();
    return data.secure_url;
    
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback to data URL
    return dataUrl;
  }
};