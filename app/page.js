"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Dumbbell,
  Flame,
  History,
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

const routinePlans = {
  "Pecho - Hombro - Triceps": [
    { exercise: "Press banca", sets: "4 x 6", rest: "120 seg" },
    { exercise: "Press inclinado mancuerna", sets: "4 x 10", rest: "90 seg" },
    { exercise: "Press militar", sets: "4 x 8", rest: "90 seg" },
    { exercise: "Elevaciones laterales", sets: "3 x 15", rest: "60 seg" },
    { exercise: "Fondos o triceps polea", sets: "3 x 12", rest: "60 seg" },
  ],
  "Espalda - Biceps": [
    { exercise: "Dominadas asistidas", sets: "4 x 8", rest: "75 seg" },
    { exercise: "Remo con barra", sets: "4 x 8", rest: "90 seg" },
    { exercise: "Jalon al pecho", sets: "3 x 12", rest: "75 seg" },
    { exercise: "Curl con barra", sets: "3 x 10", rest: "60 seg" },
    { exercise: "Curl martillo", sets: "3 x 12", rest: "60 seg" },
  ],
  Pierna: [
    { exercise: "Sentadilla", sets: "4 x 8", rest: "90 seg" },
    { exercise: "Prensa", sets: "4 x 12", rest: "90 seg" },
    { exercise: "Peso muerto rumano", sets: "3 x 10", rest: "90 seg" },
    { exercise: "Hip thrust", sets: "4 x 10", rest: "75 seg" },
    { exercise: "Gemelos", sets: "4 x 20", rest: "45 seg" },
  ],
};

const STORAGE_KEY = "gym-tracker-workouts";
const dayLabels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function getDefaultExercises(routine) {
  return routinePlans[routine].map((item) => ({
    name: item.exercise,
    sets: item.sets.split(" x ")[0] ?? "",
    reps: item.sets.split(" x ")[1] ?? "",
    weight: "",
    rest: item.rest,
  }));
}

function createEmptyExercise() {
  return {
    name: "",
    sets: "",
    reps: "",
    weight: "",
    rest: "",
  };
}

function getStartOfWeek(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

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
  const [selectedRoutine, setSelectedRoutine] = useState(
    "Pecho - Hombro - Triceps"
  );
  const [showHistory, setShowHistory] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [formData, setFormData] = useState(() => ({
    routine: "Pecho - Hombro - Triceps",
    date: new Date().toISOString().slice(0, 10),
    duration: "60",
    notes: "",
    exercises: getDefaultExercises("Pecho - Hombro - Triceps"),
  }));

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  const todayPlan = useMemo(
    () => routinePlans[selectedRoutine],
    [selectedRoutine]
  );

  const weeklyHistory = useMemo(() => {
    const startOfWeek = getStartOfWeek(new Date());
    return savedWorkouts
      .filter((workout) => new Date(workout.date) >= startOfWeek)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [savedWorkouts]);

  const weeklyVolume = useMemo(() => {
    const startOfWeek = getStartOfWeek(new Date());
    return dayLabels.map((label, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);

      const total = savedWorkouts
        .filter(
          (workout) =>
            new Date(workout.date).toDateString() === dayDate.toDateString()
        )
        .reduce((acc, workout) => {
          const load = workout.exercises.reduce((exerciseAcc, exercise) => {
            const sets = Number(exercise.sets) || 0;
            const reps = Number(exercise.reps) || 0;
            const weight = Number(exercise.weight) || 0;
            return exerciseAcc + sets * reps * Math.max(weight, 1);
          }, 0);
          return acc + load;
        }, 0);

      return { day: label, value: total };
    });
  }, [savedWorkouts]);

  const stats = useMemo(() => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const monthlyWorkouts = savedWorkouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate.getMonth() === month && workoutDate.getFullYear() === year;
    });

    const totalMinutes = savedWorkouts.reduce(
      (acc, workout) => acc + (Number(workout.duration) || 0),
      0
    );

    const bestSession = savedWorkouts.reduce((acc, workout) => {
      const currentLoad = workout.exercises.reduce((exerciseAcc, exercise) => {
        return (
          exerciseAcc +
          (Number(exercise.sets) || 0) *
            (Number(exercise.reps) || 0) *
            Math.max(Number(exercise.weight) || 1, 1)
        );
      }, 0);
      return Math.max(acc, currentLoad);
    }, 0);

    return {
      monthlyCount: monthlyWorkouts.length,
      bestSession,
      weeklyCompliance: `${Math.min(Math.round((weeklyHistory.length / 4) * 100), 100)}%`,
      totalHours: `${(totalMinutes / 60).toFixed(1)} h`,
      streak: weeklyHistory.length,
    };
  }, [savedWorkouts, weeklyHistory]);

  const maxVolume = Math.max(...weeklyVolume.map((item) => item.value), 1);

  function openWorkoutForm() {
    setFormData({
      routine: selectedRoutine,
      date: new Date().toISOString().slice(0, 10),
      duration: "60",
      notes: "",
      exercises: getDefaultExercises(selectedRoutine),
    });
    setShowForm(true);
  }

  function selectRoutine(routine) {
    setSelectedRoutine(routine);
    setFormData((current) => ({
      ...current,
      routine,
      exercises: getDefaultExercises(routine),
    }));
  }

  function updateExercise(index, field, value) {
    setFormData((current) => ({
      ...current,
      exercises: current.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index
          ? { ...exercise, [field]: value }
          : exercise
      ),
    }));
  }

  function addExercise() {
    setFormData((current) => ({
      ...current,
      exercises: [...current.exercises, createEmptyExercise()],
    }));
  }

  function removeExercise(index) {
    setFormData((current) => ({
      ...current,
      exercises:
        current.exercises.length === 1
          ? [createEmptyExercise()]
          : current.exercises.filter((_, exerciseIndex) => exerciseIndex !== index),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newWorkout = {
      id: crypto.randomUUID(),
      ...formData,
    };
    setSavedWorkouts((current) => [newWorkout, ...current]);
    setShowForm(false);
    setShowHistory(true);
  }

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
              <div className="rounded-full bg-sky-400/15 px-4 py-2 text-sm text-sky-300">
                Racha activa: {stats.streak} dias
              </div>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Gym Tracker
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Organiza tus rutinas, registra cada sesion y revisa tu semana en
                segundos. Todo pensado para que entrenar sea mas simple.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={openWorkoutForm}
                className="rounded-full bg-amber-400 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-300"
              >
                Registrar entrenamiento
              </button>
              <button
                onClick={() => setShowHistory((current) => !current)}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Ver historial
              </button>
            </div>

            {showHistory && (
              <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-200">
                  <History className="h-4 w-4 text-sky-300" />
                  Lo que has hecho en la semana
                </div>
                {weeklyHistory.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Aun no tienes entrenamientos guardados esta semana.
                  </p>
                ) : (
                <div className="space-y-3">
                  {weeklyHistory.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{session.date}</p>
                          <p className="text-sm text-slate-300">{session.routine}</p>
                        </div>
                        <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-medium text-sky-300">
                          {session.duration} min
                        </span>
                      </div>
                      {session.notes && (
                        <p className="mt-2 text-sm text-slate-400">{session.notes}</p>
                      )}
                      <p className="mt-2 text-xs text-slate-500">
                        Ejercicios:{" "}
                        {session.exercises.map((exercise) => exercise.name).join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[2.5rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Registrar entrenamiento</p>
                <h2 className="text-xl font-semibold text-slate-950">
                  {selectedRoutine}
                </h2>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {Object.keys(routinePlans).map((routine) => {
                const isActive = routine === selectedRoutine;
                return (
                  <button
                    key={routine}
                    onClick={() => selectRoutine(routine)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-950 text-white"
                        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {routine}
                  </button>
                );
              })}
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

        {showForm && (
          <section className="mb-8 rounded-[2.5rem] border border-amber-200/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Formulario</p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Registrar entrenamiento
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Rutina</span>
                  <select
                    value={formData.routine}
                    onChange={(event) => selectRoutine(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none"
                  >
                    {Object.keys(routinePlans).map((routine) => (
                      <option key={routine} value={routine}>
                        {routine}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-slate-600">
                  <span>Fecha</span>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-600">
                  <span>Duracion en minutos</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        duration: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none"
                  />
                </label>
              </div>

              <div className="space-y-3">
                {formData.exercises.map((exercise, index) => (
                  <div
                    key={`${exercise.name}-${index}`}
                    className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="flex-1 space-y-1 text-sm text-slate-600">
                        <span>Ejercicio</span>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(event) =>
                            updateExercise(index, "name", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 outline-none"
                          placeholder="Ejemplo: Press banca"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="rounded-full border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-4">
                      <label className="space-y-1 text-sm text-slate-600">
                        <span>Series</span>
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(event) =>
                            updateExercise(index, "sets", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 outline-none"
                        />
                      </label>
                      <label className="space-y-1 text-sm text-slate-600">
                        <span>Reps</span>
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(event) =>
                            updateExercise(index, "reps", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 outline-none"
                        />
                      </label>
                      <label className="space-y-1 text-sm text-slate-600">
                        <span>Peso (kg)</span>
                        <input
                          type="number"
                          min="0"
                          value={exercise.weight}
                          onChange={(event) =>
                            updateExercise(index, "weight", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 outline-none"
                        />
                      </label>
                      <label className="space-y-1 text-sm text-slate-600">
                        <span>Descanso</span>
                        <input
                          type="text"
                          value={exercise.rest}
                          onChange={(event) =>
                            updateExercise(index, "rest", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 outline-none"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addExercise}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Agregar ejercicio
              </button>

              <label className="space-y-2 text-sm text-slate-600">
                <span>Notas</span>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none"
                  placeholder="Como te fue hoy, pesos, sensaciones, tecnica..."
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Guardar entrenamiento
              </button>
            </form>
          </section>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Dumbbell}
            label="Entrenamientos este mes"
            value={String(stats.monthlyCount)}
            accent="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={Trophy}
            label="Mejor carga de sesion"
            value={String(stats.bestSession)}
            accent="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={Target}
            label="Cumplimiento semanal"
            value={stats.weeklyCompliance}
            accent="bg-rose-100 text-rose-700"
          />
          <StatCard
            icon={Activity}
            label="Tiempo total entrenado"
            value={stats.totalHours}
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
              {weeklyHistory.length === 0 ? (
                <article className="rounded-[2rem] border border-slate-200/80 bg-slate-50/80 p-5 text-sm text-slate-500">
                  Aun no tienes sesiones registradas. Usa el boton &quot;Registrar entrenamiento&quot;.
                </article>
              ) : (
                weeklyHistory.slice(0, 3).map((session, index) => (
                  <article
                    key={session.id}
                    className="rounded-[2rem] border border-slate-200/80 bg-slate-50/80 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-base font-medium text-slate-950">
                        {session.date}
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                        Sesion {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{session.routine}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {session.exercises.map((exercise) => exercise.name).join(", ")}
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-950">
                      Duracion: {session.duration} min
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
