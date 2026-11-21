"use client";

import React, { useEffect, useState, useRef } from "react";

type Homework = {
  date: string;
  subj: string;
  task: string;
  done: boolean;
};

type ChatMessage = {
  n: string;
  m: string;
  t: string;
};

function isoDate(d: Date) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export default function HomePage() {
  const todayIso = isoDate(new Date());

  const [hws, setHws] = useState<Homework[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [curYear, setCurYear] = useState(() => new Date().getFullYear());
  const [curMonth, setCurMonth] = useState(() => new Date().getMonth());
  const [selDate, setSelDate] = useState(todayIso);

  const [formDate, setFormDate] = useState(todayIso);
  const [subj, setSubj] = useState("");
  const [task, setTask] = useState("");

  const [senderName, setSenderName] = useState("");
  const [msgText, setMsgText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const savedHw = JSON.parse(localStorage.getItem("hw") || "null");
      const savedChat = JSON.parse(localStorage.getItem("chat") || "null");

      if (Array.isArray(savedHw) && savedHw.length > 0) {
        setHws(savedHw);
      } else {
        const t = new Date();
        const plusTwo = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 2);
        setHws([
          { date: isoDate(t), subj: "Математик", task: "Хуудас 42", done: false },
          { date: isoDate(plusTwo), subj: "Монгол хэл", task: "Эсэй бичих", done: false },
        ]);
      }

      if (Array.isArray(savedChat) && savedChat.length > 0) {
        setChat(savedChat);
      } else {
        setChat([
          {
            n: "Багш",
            m: "Сайн байцгаана уу! Даалгавраа цагт нь хийгээрэй.",
            t: "09:00",
          },
        ]);
      }
    } catch {
      // Fallback if localStorage is unavailable
    }
    setLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("hw", JSON.stringify(hws));
  }, [hws, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("chat", JSON.stringify(chat));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loaded]);

  function changeMonth(delta: number) {
    const next = new Date(curYear, curMonth + delta, 1);
    setCurYear(next.getFullYear());
    setCurMonth(next.getMonth());
  }

  function jumpToToday() {
    const now = new Date();
    const iso = isoDate(now);
    setCurYear(now.getFullYear());
    setCurMonth(now.getMonth());
    setSelDate(iso);
    setFormDate(iso);
  }

  function addHomework(e: React.FormEvent) {
    e.preventDefault();
    if (!formDate || !subj.trim()) return;
    setHws((prev) => [
      ...prev,
      { date: formDate, subj: subj.trim(), task: task.trim(), done: false },
    ]);
    setSelDate(formDate);
    setSubj("");
    setTask("");
  }

  function toggleHomework(index: number) {
    setHws((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
  }

  function removeHomework(index: number) {
    setHws((prev) => prev.filter((_, i) => i !== index));
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgText.trim()) return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setChat((prev) => [
      ...prev,
      { n: senderName.trim() || "Сурагч", m: msgText.trim(), t: time },
    ]);
    setMsgText("");
  }

  // Calendar grid calculations
  const firstDayOfMonth = new Date(curYear, curMonth, 1);
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const pendingCount = hws.filter((h) => !h.done).length;

  const selectedDayItems = hws
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.date === selDate);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1f2a37] flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-[#1f3a5f] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#f2b134] inline-block" />
            <span className="text-xl font-bold tracking-tight">нэг цэг</span>
            <span className="hidden sm:inline text-sm text-white/70">
              — Гэрийн даалгавар ба ангийн чат
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <a href="#features" className="text-white/80 hover:text-white transition">
              Боломжууд
            </a>
            <a
              href="#workspace"
              className="bg-[#f2b134] text-[#1f2a37] font-semibold px-4 py-2 rounded-lg hover:bg-[#e5a324] transition"
            >
              Самбар руу орох
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#1f3a5f] text-white pt-12 pb-16 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#f2b134] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-[#f2b134]" />
              Ангийн нэгдсэн орон зай
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
              Бүх хичээлийн даалгавар, ангийн мэдээлэл{" "}
              <span className="text-[#f2b134]">нэг цэгт.</span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-7 max-w-xl">
              Өдөр бүрийн гэрийн даалгавраа хуанли дээр цэгцтэй тэмдэглэж, дууссан
              даалгавраа хянаж, ангийнхантайгаа шууд харилцаарай.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#workspace"
                className="bg-[#f2b134] text-[#1f2a37] font-bold px-6 py-3 rounded-xl shadow hover:bg-[#e5a324] transition"
              >
                Одоо ашиглах ↓
              </a>
              <span className="text-sm text-white/75 px-3 py-2">
                Үлдсэн даалгавар: <strong className="text-[#f2b134]">{pendingCount}</strong>
              </span>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-semibold text-sm">Өнөөдрийн тойм ({todayIso})</span>
              <span className="text-xs bg-[#f2b134] text-[#1f2a37] font-bold px-2.5 py-0.5 rounded-full">
                Идэвхтэй
              </span>
            </div>

            <div className="space-y-2.5">
              {hws.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold text-white">{item.subj}</p>
                    <p className="text-white/70 text-xs">{item.task || "Даалгавар"}</p>
                  </div>
                  <span className="text-xs text-[#f2b134] font-medium">{item.date}</span>
                </div>
              ))}
              {hws.length === 0 && (
                <p className="text-sm text-white/70">Одоогоор даалгавар алга.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section id="features" className="max-w-6xl mx-auto w-full px-5 -mt-7">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3dfd5]">
            <div className="text-lg font-bold text-[#1f3a5f] mb-1">📅 Сар бүрийн хуанли</div>
            <p className="text-sm text-slate-600">
              Аль өдөр ямар хичээлийн даалгавар хураалгахыг нэг дор харна.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3dfd5]">
            <div className="text-lg font-bold text-[#1f3a5f] mb-1">✅ Гүйцэтгэлийн хяналт</div>
            <p className="text-sm text-slate-600">
              Хийж дууссан даалгавраа дарж тэмдэглээд явцаа хянана.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3dfd5]">
            <div className="text-lg font-bold text-[#1f3a5f] mb-1">💬 Ангийн шууд чат</div>
            <p className="text-sm text-slate-600">
              Багш, сурагчид хичээлтэй холбоотой асуулт, зараа хурдан солилцоно.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive App Workspace */}
      <main
        id="workspace"
        className="max-w-6xl mx-auto w-full px-5 py-10 grid lg:grid-cols-3 gap-6 flex-1"
      >
        {/* Calendar Section */}
        <section className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#e3dfd5]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="bg-[#1f3a5f] text-white px-3 py-1.5 rounded-lg hover:opacity-90 cursor-pointer"
                aria-label="Өмнөх сар"
              >
                ‹
              </button>
              <h2 className="text-lg font-bold min-w-[150px] text-center">
                {curYear} оны {curMonth + 1}-р сар
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="bg-[#1f3a5f] text-white px-3 py-1.5 rounded-lg hover:opacity-90 cursor-pointer"
                aria-label="Дараах сар"
              >
                ›
              </button>
            </div>

            <button
              onClick={jumpToToday}
              className="text-xs font-semibold bg-[#eef3fa] text-[#1f3a5f] px-3 py-1.5 rounded-lg hover:bg-[#dce6f5] cursor-pointer"
            >
              Өнөөдөр
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"].map((dayName) => (
              <div
                key={dayName}
                className="text-center font-semibold text-xs text-slate-500 py-1"
              >
                {dayName}
              </div>
            ))}

            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const cellIso = isoDate(new Date(curYear, curMonth, dayNum));
              const isToday = cellIso === todayIso;
              const isSelected = cellIso === selDate;
              const dayHws = hws.filter((x) => x.date === cellIso);

              return (
                <div
                  key={cellIso}
                  onClick={() => {
                    setSelDate(cellIso);
                    setFormDate(cellIso);
                  }}
                  className={`min-h-[82px] rounded-xl p-1.5 text-xs cursor-pointer transition border ${
                    isSelected
                      ? "bg-[#eef3fa] border-[#1f3a5f]"
                      : "border-[#e3dfd5] hover:bg-slate-50"
                  } ${isToday ? "ring-2 ring-[#f2b134]" : ""}`}
                >
                  <div className="font-bold mb-1">{dayNum}</div>
                  <div className="space-y-1">
                    {dayHws.map((hw, i) => (
                      <span
                        key={i}
                        className={`block rounded px-1.5 py-0.5 truncate text-[11px] font-medium ${
                          hw.done
                            ? "bg-[#b8e0c0] line-through text-slate-700"
                            : "bg-[#f2b134] text-[#1f2a37]"
                        }`}
                      >
                        {hw.subj}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sidebar: Homework Form + Class Chat */}
        <aside className="space-y-6">
          {/* Add & View Homework */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3dfd5]">
            <h3 className="font-bold text-base mb-3">
              Даалгавар нэмэх / Add homework
            </h3>
            <form onSubmit={addHomework} className="space-y-2">
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
              <input
                type="text"
                placeholder="Хичээл / Subject"
                value={subj}
                onChange={(e) => setSubj(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
              <input
                type="text"
                placeholder="Даалгавар / Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <button
                type="submit"
                className="w-full bg-[#1f3a5f] text-white font-semibold py-2 rounded-lg text-sm hover:opacity-95 cursor-pointer"
              >
                Нэмэх
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <h4 className="font-semibold text-sm mb-2">
                Сонгосон өдөр ({selDate})
              </h4>
              {selectedDayItems.length === 0 ? (
                <p className="text-xs text-slate-500">Хоосон</p>
              ) : (
                <ul className="space-y-1.5 text-sm">
                  {selectedDayItems.map(({ item, idx }) => (
                    <li
                      key={idx}
                      onClick={() => toggleHomework(idx)}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#f8f7f3] hover:bg-[#efeae0] cursor-pointer"
                    >
                      <span className={item.done ? "line-through text-slate-500" : ""}>
                        {item.done ? "✅" : "⬜"} <strong>{item.subj}</strong>
                        {item.task ? `: ${item.task}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHomework(idx);
                        }}
                        className="text-xs text-red-600 hover:underline px-1 cursor-pointer"
                        title="Устгах"
                      >
                        🗑
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Class Chat */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3dfd5]">
            <h3 className="font-bold text-base mb-3">
              Ангийн чат / Class chat
            </h3>
            <div className="h-60 overflow-y-auto bg-[#f8f7f3] rounded-xl p-3 mb-3 space-y-2 text-sm">
              {chat.map((c, idx) => (
                <div key={idx} className="bg-white p-2 rounded-lg shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <strong className="text-[#1f3a5f]">{c.n}</strong>
                    <span className="text-slate-400">{c.t}</span>
                  </div>
                  <p className="text-slate-800 break-words">{c.m}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="space-y-2">
              <input
                type="text"
                placeholder="Нэр / Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Мессеж бичих..."
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <button
                  type="submit"
                  className="bg-[#1f3a5f] text-white font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-95 cursor-pointer"
                >
                  Илгээх
                </button>
              </div>
            </form>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-[#1f3a5f] text-white/70 text-xs py-5 px-5 text-center">
        © {new Date().getFullYear()} нэг цэг — Ангийн даалгавар ба харилцааны платформ
      </footer>
    </div>
  );
}