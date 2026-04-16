type AgendaPassProps = {
  title: string;
  city: string;
  date: string;
  passType?: "main_event" | "side_event";
  verified?: boolean;
  serial?: string;
};

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AgendaPass({
  title,
  city,
  date,
  passType = "main_event",
  verified = true,
  serial = "000001",
}: AgendaPassProps) {
  const isMainEvent = passType === "main_event";

  return (
    <div className="flex justify-center">
      <div
        className={`relative w-[340px] overflow-hidden rounded-[32px] border shadow-[0_20px_80px_rgba(0,0,0,0.45)] ${
          isMainEvent
            ? "border-[#FFD600]/20 bg-[#0B0B0B]"
            : "border-white/10 bg-[#0B0B0B]"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isMainEvent
              ? "bg-[radial-gradient(circle_at_top_left,rgba(255,214,0,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,190,60,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,214,0,0.10),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%)]"
          }`}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)_28%,rgba(0,0,0,0.12)_100%)]" />
        <div className="absolute inset-0 rounded-[32px] border border-white/5" />

        <div className="relative z-10 flex min-h-[460px] flex-col p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
                  isMainEvent ? "text-[#FFD600]" : "text-[#FFD600]"
                }`}
              >
                Agenda Pass
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">
                Agenda Crypto
              </p>
            </div>

            <div
              className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                verified
                  ? "border-white/10 bg-white/[0.08] text-[#19B5C9]"
                  : "border-white/10 bg-white/[0.04] text-white/50"
              }`}
            >
              {verified ? "Verified" : "Pending"}
            </div>
          </div>

          <div className="mt-10 flex-1">
            <div
              className={`mb-5 h-px w-full ${
                isMainEvent ? "bg-[#FFD600]/15" : "bg-white/10"
              }`}
            />

            <h2 className="max-w-[240px] text-3xl font-black leading-[1.02] tracking-tight text-white">
              {title}
            </h2>

            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-white/70">{city}</p>
              <p
                className={`text-sm font-semibold ${
                  isMainEvent ? "text-[#FFD600]" : "text-[#FFD600]"
                }`}
              >
                {formatDate(date)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
                Proof of Presence
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
                {isMainEvent ? "MAIN EVENT" : "SIDE EVENT"}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isMainEvent
                  ? "border-[#FFD600]/20 bg-[#FFD600]/10"
                  : "border-white/10 bg-white/[0.08]"
              }`}
            >
              <span className="text-xs font-black tracking-[0.18em] text-white">
                AC
              </span>
            </div>
          </div>

          <div
            className={`mt-6 h-px w-full ${
              isMainEvent ? "bg-[#FFD600]/15" : "bg-white/10"
            }`}
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/25">
              Pass #{serial}
            </p>

            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}