import {
  Archive,
  ChevronDown,
  FileBox,
  Flag,
  Folder,
  Forward,
  MoreHorizontal,
  Reply,
  ReplyAll,
  Search,
  Trash,
} from "lucide-react";

type LiquidToolbarProps = {
  title: string;
};

export function LiquidToolbar({ title }: LiquidToolbarProps) {
  return (
    <div className="h-16 w-full border-b border-black/5 flex items-center justify-between px-6 bg-white/30 backdrop-blur-md z-30 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>

        <div className="apple-glass-group py-1 px-3">
          <span className="text-sm font-semibold text-black/80">{title}</span>
          <ChevronDown className="w-4 h-4 text-black/50 ml-1" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="apple-glass-group">
          <button className="apple-icon-btn px-3">
            <Reply className="w-4 h-4 stroke-[2]" />
          </button>
          <div className="apple-separator" />
          <button className="apple-icon-btn px-3">
            <ReplyAll className="w-4 h-4 stroke-[2]" />
          </button>
          <div className="apple-separator" />
          <button className="apple-icon-btn px-3">
            <Forward className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        <div className="apple-glass-group">
          <button className="apple-icon-btn px-3">
            <Archive className="w-4 h-4 stroke-[2]" />
          </button>
          <div className="apple-separator" />
          <button className="apple-icon-btn px-3">
            <Trash className="w-4 h-4 stroke-[2]" />
          </button>
          <div className="apple-separator" />
          <button className="apple-icon-btn px-3">
            <FileBox className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        <div className="apple-glass-group">
          <button className="apple-icon-btn px-3 gap-1">
            <Folder className="w-4 h-4 stroke-[2]" />
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        </div>

        <div className="apple-glass-group">
          <button className="apple-icon-btn px-3 gap-1">
            <Flag className="w-4 h-4 fill-orange-500 text-orange-500" />
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-black/60 hover:text-black hover:bg-black/5 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-black/60 hover:text-black hover:bg-black/5 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
