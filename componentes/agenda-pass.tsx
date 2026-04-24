"use client";

import { motion } from "framer-motion";

type AgendaPassProps = {
  title: string;
  city: string;
  date: string;
  passType?: "conference" | "side_event" | "online" | "happy_hour";
  verified?: boolean;
  serial?: string;
};

function formatDate(dateString: string) {
  if (!dateString) return "";
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
  passType = "conference",
  verified = true,
  serial = "000001",
}: AgendaPassProps) {
  // 🔒 garante que nunca quebra mesmo com dado errado do banco
  const safePassType =
    passType === "conference" ||
    passType === "side_event" ||
    passType === "online" ||
    passType === "happy_hour"
      ? passType
      : "conference";

  const stylesMap = {
    conference: {
      label: "CONFERÊNCIA",
      border: "border-[#FFD600]/25",
      glow:
        "bg-[radial-gradient(circle_at_top_left,rgba(255,214,0,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,180,40,0.16),transparent_28%)]",
      text: "text-[#FFD600]",
      chip: "border-[#FFD600]/20 bg-[#FFD600]/10 text-[#FFD600]",
    },
    side_event: {
      label: "SIDE EVENT",
      border: "border-[#19B5C9]/25",
      glow:
        "bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.16),transparent_28%)]",
      text: "text-[#19B5C9]",
      chip: "border-[#19B5C9]/20 bg-[#19B5C9]/10 text-[#19B5C9]",
    },
    online: {
      label: "ONLINE",
      border: "border-violet-400/30",
      glow:
        "bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.26),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(25,181,201,0.16),transparent_28%)]",
      text: "text-violet-300",
      chip: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    },
    happy_hour: {
      label: "HAPPY HOUR",
      border: "border-[#EC4899]/30",
      glow:
        "bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,214,0,0.16),transparent_28%)]",
      text: "text-[#EC4899]",
      chip: "border-[#EC4899]/20 bg-[#EC4899]/10 text-[#EC4899]",
    },
  };

  const styles = stylesMap[safePassType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="flex justify-center"
    >
      <div
        className={`relative w-[340px] overflow-hidden rounded-[32px] border ${styles.border} bg-[#0B0B0B] shadow-[0_20px_80px_rgba(0,0,0,0.45)]`}
      >
        <div className={`absolute inset-0 ${styles.glow}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_34%,rgba(0,0,0,0.16)_100%)]" />
        <div className="absolute inset-0 rounded-[32px] border border-white/5" />

        <div className="relative z-10 flex min-h-[460px] flex-col p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${styles.text}`}
              >
                Agenda Pass
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">
                Agenda Crypto
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#19B5C9]">
              {verified ? "Verified" : "Pending"}
            </div>
          </div>

          <div className="mt-10 flex-1">
            <div
              className={`mb-5 h-px w-full ${
                safePassType === "conference"
                  ? "bg-[#FFD600]/15"
                  : "bg-white/10"
              }`}
            />

            <h2 className="max-w-[240px] text-3xl font-black leading-[1.02] tracking-tight text-white">
              {title}
            </h2>

            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-white/70">{city}</p>
              <p className={`text-sm font-semibold ${styles.text}`}>
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
                {styles.label}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${styles.chip}`}
            >
              <span className="text-xs font-black tracking-[0.18em]">
                AC
              </span>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-white/10" />

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
    </motion.div>
  );
}