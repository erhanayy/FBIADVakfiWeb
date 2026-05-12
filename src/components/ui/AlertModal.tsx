import { ShieldCheck, AlertCircle, X, Info } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export function AlertModal({ isOpen, onClose, title = "FBİAD Vakfı", message, type = 'info' }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-fbiad-dark-blue flex items-center gap-2">
              {type === 'success' && <ShieldCheck className="text-green-500" size={24} />}
              {type === 'error' && <AlertCircle className="text-red-500" size={24} />}
              {type === 'warning' && <AlertCircle className="text-orange-500" size={24} />}
              {type === 'info' && <Info className="text-blue-500" size={24} />}
              {title}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{message}</p>
          <button 
            onClick={onClose}
            className="w-full bg-fbiad-blue hover:bg-fbiad-dark-blue text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
