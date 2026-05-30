import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/Button';

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ 
  imageSrc, 
  onCropComplete, 
  onCancel, 
  onSave 
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropCompleteInternal = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    onCropComplete(croppedAreaPixels);
  }, [onCropComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in" onClick={onCancel}></div>
      <div className="relative w-full max-w-lg bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-white/60 overflow-hidden transform transition-all flex flex-col animate-modal-enter">
        <div className="px-8 pt-8 pb-4">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Ajustar Foto do Perfil</h3>
          <p className="text-sm text-gray-500 mt-1">Arraste e ajuste o zoom para enquadrar o seu rosto.</p>
        </div>
        <div className="flex-1 px-8 pb-4">
          <div className="relative w-full h-[350px] bg-slate-900/5 rounded-2xl overflow-hidden shadow-inner border border-white/50">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={setZoom}
              style={{
                containerStyle: { background: 'transparent' }
              }}
            />
          </div>
          
          <div className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>Zoom</span>
                <span className="text-blue-600">{Math.round(zoom * 100)}%</span>
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-6">
              <Button variant="ghost" onClick={onCancel} className="hover:bg-gray-100/50">Cancelar</Button>
              <Button variant="primary" onClick={onSave} className="shadow-lg shadow-blue-500/20">Salvar Foto</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utilitário para criar a imagem final recortada
export const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Não foi possível criar o contexto do canvas');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) resolve(file);
      else reject(new Error('Canvas is empty'));
    }, 'image/jpeg');
  });
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(new Error('Erro ao carregar imagem para recorte')));
    // Apenas aplica crossOrigin se a URL for externa (não base64 data URI)
    if (url.startsWith('http')) {
      image.setAttribute('crossOrigin', 'anonymous');
    }
    image.src = url;
  });
