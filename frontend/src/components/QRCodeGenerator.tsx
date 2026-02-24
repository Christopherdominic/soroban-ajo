'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

export default function QRCodeGenerator({
  value,
  size = 256,
  level = 'M',
  includeMargin = true,
}: QRCodeGeneratorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCodeSVG
          value={value}
          size={size}
          level={level}
          includeMargin={includeMargin}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
        Scan this QR code to join the group
      </p>
    </div>
  );
}
