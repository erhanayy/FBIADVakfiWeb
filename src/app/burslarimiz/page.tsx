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

  useEffect(() => {
    fetch('/api/funds')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setFunds(data.data);
        }
      })
      .catch(err => console.error("Funds fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Group funds by season
  const fundsBySeason = funds.reduce((acc, fund) => {
    if (!acc[fund.season]) {
      acc[fund.season] = [];
    }
    acc[fund.season].push(fund);
    return acc;
  }, {} as Record<string, Fund[]>);

  // Sort seasons descending
  const sortedSeasons = Object.keys(fundsBySeason).sort((a, b) => b.localeCompare(a));

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-fbiad-dark-blue mb-4">
            Burslarımız
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
          <div className="space-y-16">
            {sortedSeasons.map(season => (
              <div key={season} className="space-y-8">
                <h2 className="text-3xl font-bold text-center text-fbiad-dark-blue/90 border-b pb-4">
                  {season} Dönemi
                </h2>
                <div className="flex flex-col gap-6">
                  {fundsBySeason[season].map((fund) => (
                    <div key={fund.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
                      {fund.photoUrl ? (
                        <div className="relative w-full md:w-1/3 lg:w-1/4 min-h-[250px] md:min-h-full bg-gray-100 flex-shrink-0">
                          <img 
                            src={fund.photoUrl} 
                            alt={fund.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full md:w-1/3 lg:w-1/4 min-h-[250px] md:min-h-full bg-gradient-to-br from-fbiad-dark-blue to-fbiad-blue flex items-center justify-center p-8 flex-shrink-0">
                          <img 
                            src="/fbiad-logo-white.png" 
                            alt="FBİAD Logo" 
                            className="h-24 md:h-32 object-contain opacity-30" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                              <span className="text-white/80 font-bold text-xl md:text-2xl drop-shadow-md line-clamp-3">
                                  {fund.title}
                              </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-fbiad-dark-blue mb-4">
                          {fund.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                          {fund.description}
                        </p>
                        
                        <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                          {fund.ownerName && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-fbiad-dark-blue font-bold text-lg">
                                <User size={20} className="text-fbiad-yellow" />
                                <span>Fon Sahibi: {fund.ownerName}</span>
                              </div>
                              
                              {fund.contributors && fund.contributors.length > 0 && (
                                <div className="flex items-start gap-2 text-base text-gray-500 pl-7">
                                  <Share2 size={18} className="mt-0.5 flex-shrink-0" />
                                  <span><strong className="font-semibold text-gray-600">Katkıda Bulunanlar:</strong> {fund.contributors.join(", ")}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
