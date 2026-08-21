import re

file_path = "src/pages/InsightsPage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    # Global text colors
    (r"text-slate-900", "text-white"),
    (r"text-slate-800", "text-slate-200"),
    (r"text-slate-700", "text-slate-300"),
    (r"text-slate-600", "text-slate-400"),
    
    # Cards
    (r"bg-white p-4 rounded-2xl shadow-sm border border-black divide-x divide-slate-100", "glass-card p-4 rounded-2xl divide-x divide-white/10"),
    (r"bg-white p-5 rounded-2xl border border-black shadow-sm", "glass-card p-5 rounded-2xl"),
    
    # Header icons
    (r"bg-indigo-100", "bg-indigo-500/20"),
    (r"text-indigo-700", "text-indigo-400"),
    (r"text-indigo-900", "text-indigo-300"),
    
    # Recommended Actions container
    (r"bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm", "glass-panel bg-gradient-to-r from-indigo-950/40 to-slate-900/40 p-6 rounded-2xl border border-indigo-500/20"),
    
    # Recommendation buttons
    (r"bg-white border-red-200 text-red-700 hover:bg-red-50", "bg-slate-900/50 border-red-500/30 text-red-400 hover:bg-red-500/20"),
    (r"bg-white border-orange-200 text-orange-700 hover:bg-orange-50", "bg-slate-900/50 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"),
    (r"bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-50", "bg-slate-900/50 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"),
    (r"bg-white border-blue-200 text-blue-700 hover:bg-blue-50", "bg-slate-900/50 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20"),
    (r"colors\.blue", "colors.indigo"),
    (r"dotColors\.blue", "dotColors.indigo"),
    (r"bg-blue-500", "bg-indigo-500"),
    
    # Inner cards
    (r"bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-400", "bg-slate-800/40 rounded-xl border border-white/5 hover:border-indigo-400/50"),
    (r"bg-slate-50 rounded-xl border border-slate-200", "bg-slate-800/40 rounded-xl border border-white/5"),
    (r"bg-white border border-slate-200", "bg-slate-800/60 border border-white/10"),
    
    # Badges
    (r"bg-rose-100 text-rose-700", "bg-rose-500/20 text-rose-400 border border-rose-500/30"),
    (r"bg-amber-100 text-amber-700", "bg-amber-500/20 text-amber-400 border border-amber-500/30"),
    (r"bg-blue-100 text-blue-700", "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"),
    (r"bg-white border border-rose-200 text-rose-600", "bg-rose-500/20 border border-rose-500/30 text-rose-400"),
    (r"bg-white border border-rose-200 text-rose-700", "bg-rose-500/20 border border-rose-500/30 text-rose-400"),
    (r"bg-white border border-yellow-200 text-yellow-700", "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400"),
    (r"text-rose-700", "text-rose-400"),
    
    # Warning/Error sections
    (r"bg-rose-50 rounded-xl border border-rose-100 hover:border-rose-300", "bg-rose-950/20 rounded-xl border border-rose-500/20 hover:border-rose-500/50"),
    (r"bg-rose-50 rounded-xl border border-rose-200 hover:border-rose-400", "bg-rose-950/20 rounded-xl border border-rose-500/20 hover:border-rose-500/50"),
    (r"bg-yellow-50/50 rounded-xl border border-yellow-100", "bg-yellow-950/20 rounded-xl border border-yellow-500/20"),
    (r"bg-purple-50/50 rounded-xl border border-purple-100 hover:border-purple-300", "bg-purple-950/20 rounded-xl border border-purple-500/20 hover:border-purple-500/50"),
    
    # Progress bars
    (r"bg-slate-100 rounded-full", "bg-slate-800 rounded-full"),
    (r"bg-slate-100 text-slate-600", "bg-slate-800/60 text-slate-300 border-white/5"),
    
    # Specific buttons/inputs inside cards
    (r"bg-white border border-slate-300", "bg-slate-800/80 border border-white/10 text-slate-300 hover:bg-slate-700"),
    (r"bg-white p-2 rounded border border-rose-100", "bg-slate-800/40 p-2 rounded border border-rose-500/20"),
    (r"bg-white p-1\.5 rounded border border-purple-100", "bg-slate-800/40 p-1.5 rounded border border-purple-500/20"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Refactored InsightsPage.jsx")
