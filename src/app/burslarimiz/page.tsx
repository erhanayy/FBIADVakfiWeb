"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, User, Share2 } from "lucide-react";
import { AlertModal } from "@/components/ui/AlertModal";

type Fund = {
  id: string;
  title: string;
  description: string;
  photoUrl: string | null;
  targetStudentCount: number;
  studentCount: number;
  season: string;
  ownerName?: string;
  contributors?: string[];
};

export default function BurslarimizPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState<string>("");

  useEffect(() => {
    fetch('/api/funds')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setFunds(data.data);
          if (data.data.length > 0) {
            setActiveSeason(data.data[0].season);
          }
        }
      })
      .catch(err => console.error("Funds fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fbiad-dark-blue mb-4">
            {activeSeason ? `${activeSeason} Dönemi Burslarımız` : 'Burslarımız'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Geleceğin liderlerine destek olmak amacıyla oluşturulan güncel burs fonlarımız. 
            Eğitimde fırsat eşitliğine katkı sağlayan tüm destekçilerimize teşekkür ederiz.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fbiad-blue"></div>
          </div>
        ) : funds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-gray-600">Şu anda yayınlanan aktif bir burs fonu bulunmamaktadır.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {funds.map((fund) => (
              <div key={fund.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-300">
                {fund.photoUrl ? (
                  <div className="relative h-64 w-full bg-gray-100">
                    <img 
                      src={fund.photoUrl} 
                      alt={fund.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative h-64 w-full bg-gradient-to-r from-fbiad-dark-blue to-fbiad-blue flex items-center justify-center p-8">
                    <img 
                      src="/fbiad-logo-white.png" 
                      alt="FBİAD Logo" 
                      className="h-32 object-contain opacity-30" 
                      onError={(e) => {
                          // Fallback to text if logo not found
                          e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <span className="text-white/80 font-bold text-2xl drop-shadow-md">
                            {fund.title}
                        </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-fbiad-dark-blue mb-3 line-clamp-2">
                    {fund.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-4">
                    {fund.description}
                  </p>
                  
                  <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
                    {fund.ownerName && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-fbiad-dark-blue font-medium">
                          <User size={18} className="text-fbiad-yellow" />
                          <span>Fon Sahibi: {fund.ownerName}</span>
                        </div>
                        
                        {fund.contributors && fund.contributors.length > 0 && (
                          <div className="flex items-start gap-2 text-sm text-gray-500 pl-6">
                            <Share2 size={16} className="mt-0.5 flex-shrink-0" />
                            <span>Katkıda Bulunanlar: {fund.contributors.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="bg-fbiad-yellow/10 text-fbiad-dark-blue px-4 py-2 rounded-lg flex items-center gap-2 font-bold">
                        <Users size={20} className="text-fbiad-yellow" />
                        Desteklenen Öğrenci: {fund.studentCount} / {fund.targetStudentCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
