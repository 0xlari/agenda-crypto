"use client";

import { motion, AnimatePresence } from "framer-motion";
import AgendaPass from "@/componentes/agenda-pass";

type PassType = "conference" | "side_event" | "online" | "happy_hour";

type Props = {
  open: boolean;
  onClose: () => void;
  event: {
    title: string;
    city: string | null;
    start_date?: string | null;
    event_type?: PassType | null;
  } | null;
};

export default function PassDropModal({ open, onClose, event }: Props) {
  if (!event) return null;

  const passType: PassType = event.event_type || "conference";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.7, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm font-bold uppercase tracking-[0.28em] text-[#FFD600]"
            >
              Agenda Pass desbloqueado
            </motion.p>

            <AgendaPass
              title={event.title}
              city={event.city || "Online"}
              date={event.start_date || ""}
              passType={passType}
              verified
            />

            <button
              onClick={onClose}
              className="rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black"
            >
              Ver meus passes
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}