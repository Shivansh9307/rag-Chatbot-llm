export function VibrantWallpaper() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#f0f0f5]">
      <div
        className="animate-ambient-drift absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-[100%] opacity-80 mix-blend-multiply blur-[100px]"
        style={{ background: "radial-gradient(ellipse, #ffb199 0%, #ff0844 100%)" }}
      />
      <div
        className="animate-ambient-drift-reverse absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-[100%] opacity-80 mix-blend-multiply blur-[120px]"
        style={{ background: "radial-gradient(ellipse, #4facfe 0%, #00f2fe 100%)" }}
      />
      <div
        className="animate-ambient-drift absolute top-[30%] right-[10%] w-[50%] h-[50%] rounded-[100%] opacity-70 mix-blend-multiply blur-[90px]"
        style={{ background: "radial-gradient(ellipse, #fbc2eb 0%, #a18cd1 100%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
