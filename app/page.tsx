"use client";

import { useState, useEffect } from "react";
import { Clock, Loader, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Goal {
  text: string;
  status?: "pending" | "inprogress" | "completed";
}

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Fetch goals from API
  useEffect(() => {
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => setGoals(data.goals || []));
  }, []);

  // Dummy status counts
  const pendingCount = goals.filter((g) => g.status === "pending" || !g.status).length;
  const inProgressCount = goals.filter((g) => g.status === "inprogress").length;
  const completedCount = goals.filter((g) => g.status === "completed").length;

  return (
    <div className="w-full h-full flex flex-col gap-8">
      {/* Page Title and Welcome */}
      <h1 className="text-3xl font-extrabold text-white mb-2">Dashboard</h1>
      <div className="text-lg text-gray-200 mb-4">Welcome back, John Doe!</div>
      {/* Top widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 bg-purple-200 dark:bg-purple-700 shadow-lg rounded-2xl p-6 transition-transform duration-150 hover:scale-105 cursor-default">
          <Clock className="w-10 h-10 text-purple-700 dark:text-purple-300 drop-shadow" />
          <div>
            <div className="text-lg font-bold text-purple-700 dark:text-purple-300 drop-shadow">Pending</div>
            <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 drop-shadow">{pendingCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-blue-200 dark:bg-blue-700 shadow-lg rounded-2xl p-6 transition-transform duration-150 hover:scale-105 cursor-default">
          <Loader className="w-10 h-10 text-blue-700 dark:text-blue-300 drop-shadow" />
          <div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300 drop-shadow">In Progress</div>
            <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 drop-shadow">{inProgressCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-pink-200 dark:bg-pink-700 shadow-lg rounded-2xl p-6 transition-transform duration-150 hover:scale-105 cursor-default">
          <CheckCircle className="w-10 h-10 text-pink-700 dark:text-pink-300 drop-shadow" />
          <div>
            <div className="text-lg font-bold text-pink-700 dark:text-pink-300 drop-shadow">Completed</div>
            <div className="text-2xl font-extrabold text-pink-700 dark:text-pink-300 drop-shadow">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Main two-column section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        {/* Goals Overview (left, spans 2 columns) */}
        <section className="col-span-1 md:col-span-2 flex flex-col bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-pink-700 tracking-tight">Goals Overview</h2>
            <Link href="/goals" className="text-pink-600 font-semibold hover:underline">View All</Link>
          </div>
          <ul className="space-y-3">
            {goals.length === 0 && (
              <li className="text-gray-400 py-4 text-center bg-gray-50 dark:bg-gray-900/40 rounded-xl">
                No goals yet. Start by adding your first goal!
              </li>
            )}
            {goals.slice(0, 5).map((goal, idx) => (
              <li 
                key={idx} 
                className="group bg-white/80 dark:bg-gray-900/60 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 flex items-center gap-3"
                style={{
                  borderLeftColor: 
                    goal.status === "completed" ? "#ec4899" : 
                    goal.status === "inprogress" ? "#3b82f6" : 
                    "#a855f7"
                }}
              >
                <span className="text-pink-600 font-bold text-lg">•</span>
                <span className="flex-1 font-medium text-gray-900 dark:text-white">{goal.text}</span>
                <span 
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                    goal.status === "completed" 
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" 
                      : goal.status === "inprogress"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}
                >
                  {goal.status === "completed"
                    ? "Completed"
                    : goal.status === "inprogress"
                    ? "In Progress"
                    : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </section>
        {/* Right column: AI Coach and Premium stacked */}
        <div className="flex flex-col gap-8">
          {/* AI Coach */}
          <section className="bg-gradient-to-br from-blue-500/80 to-pink-500/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/80 dark:bg-gray-900/60 rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow">
                🤖
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-white text-lg mb-1 tracking-tight">Your AI Coach is here!</div>
                <div className="text-white/80 text-sm">Get personalized guidance and motivation to help you achieve your goals faster.</div>
              </div>
            </div>
            <button className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">Ask Coach</button>
          </section>
          {/* Premium */}
          <section className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
            <div>
              <div className="font-extrabold text-lg text-gray-900 dark:text-white mb-1 tracking-tight">💳 Unlock Premium Features</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm mb-4">Subscribe for $5/month with Stripe</div>
            </div>
            <Link href="/subscription" className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 block text-center">Subscribe</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
