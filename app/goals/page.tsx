"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical, GripVertical, Plus } from "lucide-react";

interface Goal {
  text: string;
  status: "pending" | "inprogress" | "completed";
  isNew?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-purple-200 text-purple-700",
  inprogress: "bg-blue-200 text-blue-700",
  completed: "bg-green-200 text-green-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  inprogress: "In Progress",
  completed: "Completed",
};

const allStatuses: Goal["status"][] = ["pending", "inprogress", "completed"];

const mockGoals: Goal[] = [
  { text: "Read a book", status: "pending" },
  { text: "Finish project report", status: "inprogress" },
  { text: "Workout 3x this week", status: "pending" },
  { text: "Submit tax documents", status: "completed" },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<number | null>(null);
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isAnyMenuOpen = openMenu !== null || openStatusDropdown !== null;

  useEffect(() => {
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        if (data.goals && data.goals.length > 0) {
          setGoals(data.goals);
        } else {
          setGoals(mockGoals);
        }
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isAnyMenuOpen &&
        menuRefs.current[openMenu || openStatusDropdown!] && // Use whichever is open
        !menuRefs.current[openMenu || openStatusDropdown!]?.contains(event.target as Node)
      ) {
        setOpenMenu(null);
        setOpenStatusDropdown(null);
      }
    }
    if (isAnyMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAnyMenuOpen, openMenu, openStatusDropdown]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setLoading(true);
    const newGoalObj: Goal = { text: newGoal, status: "pending", isNew: true };
    setGoals((prev) => [newGoalObj, ...prev]);
    setNewGoal("");
    setLoading(false);
  };

  // Drag and drop handlers (mock, local state only)
  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    setGoals((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(draggedIdx, 1);
      updated.splice(idx, 0, removed);
      return updated;
    });
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  // Actions menu
  const handleUpdateStatus = (idx: number, status: Goal["status"]) => {
    setGoals((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status, isNew: false };
      return updated;
    });
    setOpenMenu(null);
    setOpenStatusDropdown(null);
  };
  const handleDelete = (idx: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== idx));
    setOpenMenu(null);
    setOpenStatusDropdown(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold text-white mb-2">Goals</h1>
      <div className="text-lg text-gray-200 mb-4">Track your progress and achieve your dreams, one goal at a time.</div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        {/* Add Goal Form */}
        <div className="rounded-xl shadow-inner-lg flex items-center gap-2">
          <form onSubmit={handleAddGoal} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <input
                className="w-full px-5 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent pl-12"
                type="text"
                placeholder="Enter a new goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                disabled={loading}
              />
              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold px-6 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
        {/* Goals List */}
        <ul className="flex flex-col gap-4 mt-3">
          {goals.length === 0 && <li className="text-gray-400 py-4">No goals yet.</li>}
          {goals.map((goal, idx) => (
            <li
              key={idx}
              className={`relative flex flex-col gap-2 p-4 pt-10 pb-4 group select-none rounded-2xl shadow-md bg-white dark:bg-gray-900 transition-all duration-150 border-l-8
                ${goal.status === "pending" ? "border-purple-500" : goal.status === "inprogress" ? "border-blue-500" : "border-green-500"}
                ${draggedIdx === idx ? "ring-2 ring-pink-400/60 scale-[1.01]" : isAnyMenuOpen ? "" : "hover:scale-[1.01] hover:shadow-lg"}
                md:flex-row md:items-center md:p-4`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => { e.preventDefault(); handleDragOver(idx); }}
              onDragEnd={handleDragEnd}
            >
              {/* Drag indicator */}
              <span className="absolute top-4 left-4 md:relative md:top-auto md:left-auto cursor-grab text-gray-300 group-hover:text-pink-500 md:mr-2"><GripVertical className="w-5 h-5" /></span>

              {/* Content (Status and Goal Text) */}
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:flex-1">
                {/* Goal text */}
                <span className="text-lg font-bold text-gray-900 dark:text-white md:ml-2">
                  {goal.text}
                  {goal.isNew && <span className="ml-2 text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full align-middle">New</span>}
                </span>
              </div>
                {/* Status badge */}
                <span className={`text-xs font-semibold me-6 px-3 py-1 rounded-full shadow-sm w-fit ${statusColors[goal.status]}`}>{statusLabels[goal.status]}</span>
              {/* Actions menu (dropdown) */}
              <div className="absolute top-4 right-4 md:relative md:top-auto md:right-auto flex-shrink-0 md:ml-auto" ref={el => { menuRefs.current[idx] = el; }}>
                <button
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-900 shadow transition"
                  onClick={e => { e.preventDefault(); setOpenMenu(openMenu === idx ? null : idx); setOpenStatusDropdown(null); }}
                  title="Actions"
                  type="button"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
                {openMenu === idx && (
                  <div className="absolute right-0 top-10 min-w-[160px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-30 animate-fade-in">
                    <button
                      className="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-pink-900 rounded-t-xl transition"
                      onClick={e => { e.stopPropagation(); setOpenStatusDropdown(idx); setOpenMenu(null); }}
                    >
                      Update Status
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-b-xl transition"
                      onClick={() => handleDelete(idx)}
                    >
                      Delete
                    </button>
                  </div>
                )}
                {openStatusDropdown === idx && (
                  <div className="absolute right-0 top-10 min-w-[160px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-30 animate-fade-in">
                    {allStatuses.filter(s => s !== goal.status).map(status => (
                      <button
                        key={status}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-pink-900 rounded-xl transition"
                        onClick={() => handleUpdateStatus(idx, status)}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating AI Button */}
      <button
        className="fixed bottom-20 md:bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center group"
        onClick={() => {/* TODO: Implement AI chat */}}
        title="Chat with AI Coach"
      >
        <span className="text-2xl group-hover:animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] filter brightness-110">🤖</span>
      </button>
    </div>
  );
} 