import {
  Activity,
  CalendarDays,
  Dumbbell,
  Flame,
  Target,
  Trophy,
} from "lucide-react";

const weeklyVolume = [
  { day: "Lun", value: 42 },
  { day: "Mar", value: 58 },
  { day: "Mie", value: 35 },
  { day: "Jue", value: 67 },
  { day: "Vie", value: 51 },
  { day: "Sab", value: 73 },
  { day: "Dom", value: 28 },
];

const todayPlan = [
  { exercise: "Sentadilla", sets: "4 x 8", rest: "90 seg" },
  { exercise: "Press banca", sets: "4 x 6", rest: "120 seg" },
  { exercise: "Peso muerto rumano", sets: "3 x 10", rest: "90 seg" },
  { exercise: "Dominadas asistidas", sets: "3 x 8", rest: "75 seg" },
];

const recentSessions = [
  { day: "Lunes", focus: "Piernas + core", duration: "68 min" },
  { day: "Miercoles", focus: "Push", duration: "54 min" },
  { day: "Viernes", focus: "Espalda + biceps", duration: "61 min" },
];

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <article className="rounded-[2rem] border border-white/50 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </article>
  );
}

export default function Home() {
  const maxVolume = Math.max(...weeklyVolume.map((item) => item.value));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_30%),linear-gradient(180deg,#fffaf0_0%,#f8fafc_42%,#eef2ff_100%)] px-5 py-6 text-slate-950 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.22)] sm:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                <Flame className="h-4 w-4 text-amber-300" />
                Gym Tracker
              </div>
              <div className="rounded-full bg-emerald-400/15 px-4 py-2 text-sm text-emerald-300">
                Racha activa: 6 dias
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.28em] text-slate-400">
                Dashboard principal
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Registra tus entrenamientos, mide tu progreso y manten tu
                constancia.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Una vista clara para sesiones, volumen semanal, objetivos y
                rendimiento. Pensada para usarla rapido antes, durante y despues
                del gym.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-amber-400 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-300">
                Iniciar entrenamiento
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                Ver historial
              </button>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Plan de hoy</p>
                <h2 className="text-xl font-semibold text-slate-950">
                  Full body de fuerza
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {todayPlan.map((item) => (
                <div
                  key={item.exercise}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-950">{item.exercise}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.sets} · Descanso {item.rest}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      Pendiente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Dumbbell}
            label="Entrenamientos este mes"
            value="18"
            accent="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={Trophy}
            label="PRs conseguidos"
            value="4"
            accent="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={Target}
            label="Cumplimiento semanal"
            value="86%"
            accent="bg-rose-100 text-rose-700"
          />
          <StatCard
            icon={Activity}
            label="Tiempo total entrenado"
            value="7.8 h"
            accent="bg-sky-100 text-sky-700"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2.5rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Volumen semanal</p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Carga de entrenamiento
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                Ultimos 7 dias
              </span>
            </div>

            <div className="flex h-72 items-end gap-3 rounded-[2rem] bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-5">
              {weeklyVolume.map((item) => (
                <div
                  key={item.day}
                  className="flex flex-1 flex-col items-center justify-end gap-3"
                >
                  <div className="relative flex h-52 w-full items-end">
                    <div
                      className="w-full rounded-t-[1.5rem] bg-[linear-gradient(180deg,#f59e0b_0%,#f97316_100%)] shadow-[0_12px_30px_rgba(249,115,22,0.28)]"
                      style={{ height: `${(item.value / maxVolume) * 100}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-500">{item.day}</p>
                    <p className="text-sm font-semibold text-slate-950">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.5rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Sesiones recientes</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Ultimos entrenamientos
              </h2>
            </div>

            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <article
                  key={`${session.day}-${session.focus}`}
                  className="rounded-[2rem] border border-slate-200/80 bg-slate-50/80 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-base font-medium text-slate-950">
                      {session.day}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                      Sesion {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{session.focus}</p>
                  <p className="mt-3 text-sm font-medium text-slate-950">
                    Duracion: {session.duration}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
