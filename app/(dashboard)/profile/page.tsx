"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Camera, User as UserIcon } from 'lucide-react';
import { ImageCropper, getCroppedImg } from '@/components/ui/ImageCropper';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  
  // Imagem & Crop States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = api.getCurrentUser();
    if (!u) {
      router.push('/');
      return;
    }
    setUser(u);
    setName(u.name || '');
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('A atualizar perfil...');
    try {
      const res = await api.updateProfile({ name });
      setUser(res.user);
      queryClient.setQueryData(['currentUser'], res.user);
      toast.success('Perfil atualizado com sucesso!', { id: toastId });
    } catch (error) {
      toast.error('Erro ao atualizar perfil.', { id: toastId });
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropping(true);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result as string), false);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' });
      
      const toastId = toast.loading('A enviar foto...');
      const res = await api.uploadAvatar(file);
      setUser(res.user);
      queryClient.setQueryData(['currentUser'], res.user);
      toast.success('Foto atualizada com sucesso!', { id: toastId });
      
      setIsCropping(false);
      setImageSrc(null);
    } catch (e: any) {
      console.error(e);
      const errorMessage = typeof e === 'string' ? e : (e.message || 'Erro desconhecido');
      try {
        const parsed = JSON.parse(errorMessage);
        toast.error(parsed.error || 'Erro ao recortar/enviar imagem.');
      } catch {
        toast.error(errorMessage);
      }
    }
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen text-gray-500">A carregar...</div>;

  // Usa a rota da API (assumindo que o backend está na porta 3001) para carregar o avatar, ou o fallback local
  const avatarUrl = user.avatar_url 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${user.avatar_url}`
    : null;

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">O Meu Perfil</h1>
          <p className="text-gray-500 mt-1">Gerencie as suas informações e foto de perfil.</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100 pb-8 pt-8">
            <div className="flex flex-col items-center sm:flex-row sm:space-x-8">
              {/* Avatar Section */}
              <div className="relative group cursor-pointer mb-6 sm:mb-0" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-gray-400" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="text-white" size={28} />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>

              {/* User Info Overview */}
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="pt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="O seu nome"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input 
                  value={user.email} 
                  disabled 
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">O email não pode ser alterado no momento.</p>
              </div>

              <div className="pt-4">
                <Button type="submit" variant="primary">
                  Guardar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Cropper Modal */}
      {isCropping && imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={(croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
          onCancel={() => {
            setIsCropping(false);
            setImageSrc(null);
          }}
          onSave={handleSaveCrop}
        />
      )}
    </main>
  );
}
