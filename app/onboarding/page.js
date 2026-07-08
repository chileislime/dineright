'use client'

// DineRight — Onboarding & Macro Target Setup
// This page collects the user's stats, calculates their TDEE
// (Total Daily Energy Expenditure), and turns it into daily
// calorie + macro targets based on their goal.

import { useState } from 'react'

// ------------------------------------------------------------
// THE MATH (explained in plain English)
// ------------------------------------------------------------
// Step 1: BMR (Mifflin-St Jeor equation) — calories your body
//         burns just existing, based on weight/height/age/sex.
// Step 2: TDEE = BMR x activity multiplier — total burn
//         including walking to class, workouts, dining hall shifts.
// Step 3: Goal adjustment — eat above TDEE to build (lean bulk),
//         below it to lose (cut), or right at it (maintain).
// Step 4: Macros — protein set by bodyweight, fat as a % of
//         calories, carbs fill whatever calories remain.
// ------------------------------------------------------------

const ACTIVITY_LEVELS = [
  { value: 'sedentary',   label: 'Sedentary — little or no exercise',            multiplier: 1.2 },
  { value: 'light',       label: 'Light — exercise 1-3 days/week',               multiplier: 1.375 },
  { value: 'moderate',    label: 'Moderate — exercise 3-5 days/week',            multiplier: 1.55 },
  { value: 'active',      label: 'Active — exercise 6-7 days/week',              multiplier: 1.725 },
  { value: 'very_active', label: 'Very active — hard exercise + physical job',   multiplier: 1.9 },
]

const GOALS = [
  { value: 'lean_bulk', label: 'Lean Bulk', blurb: 'Build muscle with minimal fat gain', calorieAdjust: 1.10 },
  { value: 'cut',       label: 'Cut',       blurb: 'Lose fat while keeping muscle',      calorieAdjust: 0.80 },
  { value: 'maintain',  label: 'Maintain',  blurb: 'Stay where you are, eat smarter',    calorieAdjust: 1.00 },
]

function calculateTargets({ goal, sex, age, weightLb, heightIn, activity }) {
  // Convert to metric — the formula uses kg and cm
  const weightKg = weightLb * 0.453592
  const heightCm = heightIn * 2.54

  // Step 1: BMR (Mifflin-St Jeor)
  const bmr =
    10 * weightKg +
    6.25 * heightCm -
    5 * age +
    (sex === 'male' ? 5 : -161)

  // Step 2: TDEE
  const multiplier = ACTIVITY_LEVELS.find(a => a.value === activity).multiplier
  const tdee = bmr * multiplier

  // Step 3: Adjust for goal
  const goalInfo = GOALS.find(g => g.value === goal)
  const calories = Math.round(tdee * goalInfo.calorieAdjust)

  // Step 4: Macros
  // Protein: 0.9g per lb of bodyweight (solid default for beginners)
  const protein = Math.round(weightLb * 0.9)
  // Fat: 25% of total calories (1g fat = 9 calories)
  const fat = Math.round((calories * 0.25) / 9)
  // Carbs: whatever calories are left (1g protein/carb = 4 calories)
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

  return { calories, protein, carbs, fat, tdee: Math.round(tdee) }
}

export default function Onboarding() {
  // Form state — one piece of state per input
  const [goal, setGoal] = useState(null)
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState('')
  const [weightLb, setWeightLb] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightExtraIn, setHeightExtraIn] = useState('')
  const [activity, setActivity] = useState('moderate')
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  function handleCalculate() {
    // Basic validation — make sure everything is filled in sensibly
    if (!goal) return setError('Pick a goal first — that choice drives everything else.')
    if (!age || age < 15 || age > 80) return setError('Enter an age between 15 and 80.')
    if (!weightLb || weightLb < 70 || weightLb > 500) return setError('Enter a weight between 70 and 500 lb.')
    if (heightFt === '' || heightFt < 4 || heightFt > 7) return setError('Enter height in feet (4-7).')

    setError('')
    const heightIn = Number(heightFt) * 12 + Number(heightExtraIn || 0)
    const targets = calculateTargets({
      goal,
      sex,
      age: Number(age),
      weightLb: Number(weightLb),
      heightIn,
      activity,
    })
    setResults(targets)

    // Save everything locally — no account needed yet.
    // When we add Supabase Auth later, this same object goes
    // into the profiles table instead.
    localStorage.setItem('dineright_profile', JSON.stringify({
      goal, sex, age, weightLb, heightIn, activity, targets,
    }))
  }

  return (
    <main className="min-h-screen bg-green-950 text-white px-4 py-10">
      <div className="max-w-xl mx-auto">

        <h1 className="text-3xl font-bold mb-1">
          <span className="text-white">Dine</span>
          <span className="text-green-400">Right</span>
        </h1>
        <p className="text-green-300 mb-8">
          A few quick questions. We do the math, you eat the food.
        </p>

        {/* ---------- GOAL ---------- */}
        <label className="block text-green-200 font-semibold mb-2">Your goal</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {GOALS.map(g => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={`rounded-lg p-3 text-left border transition
                ${goal === g.value
                  ? 'bg-green-400 text-green-950 border-green-400'
                  : 'bg-green-900 border-green-800 hover:border-green-500'}`}
            >
              <div className="font-bold">{g.label}</div>
              <div className={`text-xs ${goal === g.value ? 'text-green-900' : 'text-green-400'}`}>
                {g.blurb}
              </div>
            </button>
          ))}
        </div>

        {/* ---------- STATS ---------- */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-green-200 font-semibold mb-2">Sex</label>
            <select
              value={sex}
              onChange={e => setSex(e.target.value)}
              className="w-full rounded-lg bg-green-900 border border-green-800 p-3"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-green-200 font-semibold mb-2">Age</label>
            <input
              type="number" value={age} placeholder="19"
              onChange={e => setAge(e.target.value)}
              className="w-full rounded-lg bg-green-900 border border-green-800 p-3"
            />
          </div>
          <div>
            <label className="block text-green-200 font-semibold mb-2">Weight (lb)</label>
            <input
              type="number" value={weightLb} placeholder="165"
              onChange={e => setWeightLb(e.target.value)}
              className="w-full rounded-lg bg-green-900 border border-green-800 p-3"
            />
          </div>
          <div>
            <label className="block text-green-200 font-semibold mb-2">Height</label>
            <div className="flex gap-2">
              <input
                type="number" value={heightFt} placeholder="5"
                onChange={e => setHeightFt(e.target.value)}
                className="w-full rounded-lg bg-green-900 border border-green-800 p-3"
              />
              <span className="self-center text-green-400">ft</span>
              <input
                type="number" value={heightExtraIn} placeholder="10"
                onChange={e => setHeightExtraIn(e.target.value)}
                className="w-full rounded-lg bg-green-900 border border-green-800 p-3"
              />
              <span className="self-center text-green-400">in</span>
            </div>
          </div>
        </div>

        {/* ---------- ACTIVITY ---------- */}
        <label className="block text-green-200 font-semibold mb-2">Activity level</label>
        <select
          value={activity}
          onChange={e => setActivity(e.target.value)}
          className="w-full rounded-lg bg-green-900 border border-green-800 p-3 mb-6"
        >
          {ACTIVITY_LEVELS.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>

        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}

        <button
          onClick={handleCalculate}
          className="w-full bg-green-400 hover:bg-green-300 text-green-950 font-bold rounded-lg p-4 mb-8 transition"
        >
          Calculate my targets
        </button>

        {/* ---------- RESULTS ---------- */}
        {results && (
          <div className="bg-green-900 border border-green-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-1">Your daily targets</h2>
            <p className="text-green-400 text-sm mb-4">
              Your body burns about {results.tdee} calories a day. To{' '}
              {goal === 'lean_bulk' ? 'build muscle, eat a bit above that:' :
               goal === 'cut' ? 'lose fat, eat below that:' :
               'maintain, match it:'}
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-950 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">{results.calories}</div>
                <div className="text-green-300 text-sm">calories</div>
              </div>
              <div className="bg-green-950 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">{results.protein}g</div>
                <div className="text-green-300 text-sm">protein</div>
              </div>
              <div className="bg-green-950 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">{results.carbs}g</div>
                <div className="text-green-300 text-sm">carbs</div>
              </div>
              <div className="bg-green-950 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">{results.fat}g</div>
                <div className="text-green-300 text-sm">fat</div>
              </div>
            </div>
            <p className="text-green-400 text-sm mt-4">
              Saved. Next stop: today's menu at Phelps.
            </p>
          </div>
        )}

      </div>
    </main>
  )
}