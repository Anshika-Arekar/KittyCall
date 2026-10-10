'use client';

import React, { useState } from 'react';
import type { CatPhoto } from '@/lib/types/database';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { compressImage } from '@/lib/utils/image-compression';
import { uploadCatPhoto, deleteCatPhoto, setPrimaryPhoto } from '@/actions/profile';

interface CatPhotoGalleryProps {
  catId: string;
  photos: CatPhoto[];
  isEditable?: boolean;
}

export function CatPhotoGallery({ catId, photos: initialPhotos, isEditable = false }: CatPhotoGalleryProps) {
  const [photos, setPhotos] = useState<CatPhoto[]>(initialPhotos);
  const [activePhoto, setActivePhoto] = useState<string | null>(
    photos.find((p) => p.is_primary)?.url || photos[0]?.url || null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Compress client side before upload to respect 1GB storage limit
      const compressedBlob = await compressImage(file, { maxWidth: 1024, maxHeight: 1024, quality: 0.82 });
      const formData = new FormData();
      formData.append('file', compressedBlob, file.name);

      const res = await uploadCatPhoto(catId, formData);
      if (res.error) {
        setError(res.error);
      } else if (res.photo) {
        setPhotos([...photos, res.photo]);
        if (!activePhoto) {
          setActivePhoto(res.photo.url);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to process photo');
    } finally {
      setUploading(false);
    }
  }

  async function handleSetPrimary(photoId: string) {
    const res = await setPrimaryPhoto(catId, photoId);
    if (!res.error) {
      setPhotos(
        photos.map((p) => ({
          ...p,
          is_primary: p.id === photoId,
        }))
      );
    }
  }

  async function handleDelete(photoId: string) {
    if (photos.length <= 1) {
      setError('A cat profile must have at least one photo.');
      return;
    }

    const res = await deleteCatPhoto(catId, photoId);
    if (!res.error) {
      const remaining = photos.filter((p) => p.id !== photoId);
      setPhotos(remaining);
      if (activePhoto === photos.find((p) => p.id === photoId)?.url) {
        setActivePhoto(remaining[0]?.url || null);
      }
    }
  }

  return (
    <div className="flex flex-col gap-3 font-mono">
      {error && (
        <div className="p-2 bg-[#F08080] border border-[#292631] text-[11px] text-white font-bold rounded">
          {error}
        </div>
      )}

      {/* Main Preview Photo */}
      {activePhoto && (
        <div className="relative aspect-square w-full rounded-retro border-[2.5px] border-[#292631] overflow-hidden shadow-retro bg-[#F6EEDC]">
          <img
            src={activePhoto}
            alt="Cat display"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Gallery Thumbnails */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {photos.map((photo) => {
          const isActive = activePhoto === photo.url;
          return (
            <div
              key={photo.id}
              className={`
                relative w-16 h-16 shrink-0 rounded-retro border-2 border-[#292631] overflow-hidden cursor-pointer shadow-retro-sm
                ${isActive ? 'ring-2 ring-[#F3A6B8] scale-105' : 'opacity-80 hover:opacity-100'}
              `}
              onClick={() => setActivePhoto(photo.url)}
            >
              <img
                src={photo.url}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />

              {photo.is_primary && (
                <span className="absolute top-0 left-0 bg-[#A7C98B] text-[8px] font-bold px-1 border-r border-b border-[#292631]">
                  MAIN
                </span>
              )}

              {isEditable && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col justify-between p-0.5 transition-opacity">
                  {!photo.is_primary && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPrimary(photo.id);
                      }}
                      className="bg-[#A7C98B] text-[7px] text-[#292631] font-bold p-0.5 rounded border border-[#292631]"
                    >
                      STAR
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    className="bg-[#F08080] text-[7px] text-white font-bold p-0.5 rounded border border-[#292631] self-end"
                  >
                    DEL
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Upload Button */}
        {isEditable && (
          <label className="w-16 h-16 shrink-0 rounded-retro border-2 border-dashed border-[#292631] bg-[#FFF8E8] hover:bg-[#F6EEDC] flex flex-col items-center justify-center cursor-pointer shadow-retro-sm">
            <PixelIcon name="star" size={14} className="text-[#9B8ACB]" />
            <span className="text-[9px] font-bold mt-1 text-[#292631]">
              {uploading ? '...' : '+ ADD'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
