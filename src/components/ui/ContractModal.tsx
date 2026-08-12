'use client';

import { X } from "lucide-react";
import { useEffect } from "react";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onAccept: () => void;
  isAccepted: boolean;
}

export function ContractModal({ isOpen, onClose, title, content, onAccept, isAccepted }: ContractModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-[#1E3A5F]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
          {content || "Yükleniyor..."}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Kapat
          </button>
          {!isAccepted && (
            <button 
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
            >
              Okudum, Onaylıyorum
            </button>
          )}
          {isAccepted && (
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold opacity-80 cursor-default"
            >
              Onaylandı
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
