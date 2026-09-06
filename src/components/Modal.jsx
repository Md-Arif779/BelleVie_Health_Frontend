import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-bv-card max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between pb-4 border-b border-bv-card mb-4">
          <h3 className="text-lg font-bold text-bv-dark">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-bv-gray hover:text-bv-dark rounded-lg hover:bg-bv-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;