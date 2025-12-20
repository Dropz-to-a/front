// src/components/contracts/Modal.tsx

export default function Modal({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 모달 박스 */}
            <div className="relative bg-white p-6 rounded-xl shadow-xl w-80 z-10">
                {children}
            </div>
        </div>
    );
}
