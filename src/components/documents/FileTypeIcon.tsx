import { FileText, Image as ImageIcon } from "lucide-react";

interface Props {
  fileType: string;
  size?: number;
}

export default function FileTypeIcon({ fileType, size = 32 }: Props) {
  let Icon = FileText;
  let bgClass = "bg-gray-500/10";
  let textClass = "text-gray-500";

  switch (fileType) {
    case "PDF":
      Icon = FileText;
      bgClass = "bg-red-500/10";
      textClass = "text-red-500";
      break;
    case "JPG":
    case "PNG":
    case "WEBP":
      Icon = ImageIcon;
      bgClass = "bg-blue-500/10";
      textClass = "text-blue-500";
      break;
    case "DOCX":
      Icon = FileText;
      bgClass = "bg-indigo-500/10";
      textClass = "text-indigo-500";
      break;
  }

  const padding = size > 24 ? "p-2" : "p-1";

  return (
    <div className={`rounded-lg flex items-center justify-center ${bgClass} ${textClass} ${padding}`} style={{ width: size, height: size }}>
      <Icon size={size * 0.6} />
    </div>
  );
}
