// DineRight — Today's Menu
// Fetches today's offerings from Supabase and displays them
// grouped by meal period (Breakfast / Lunch / Dinner), then
// by station within each meal.

import { supabase } from '../../lib/supabase'

// Tell Next.js to fetch fresh data on every visit —
// menus change daily, so we never want a cached copy.
export const dynamic = 'force-dynamic'

const PERIODS = ['breakfast', 'lunch', 'dinner']

export default async function Menu() {
  // Today's date in YYYY-MM-DD, in the user's local timezone
  const today = new Date().toLocaleDateString('en-CA')

  // One query: offerings for today, each with its station
  // and full menu item (macros, allergens, flags) attached.
  const { data: offerings, error } = await supabase
    .from('menu_offerings')
    .select(`
      period,
      station:stations ( name, sort_order ),
      item:menu_items ( * )
    `)
    .eq('served_on', today)

  if (error) {
    return (
      <main className="min-h-screen bg-green-950 text-white p-8">
        <p className="text-red-400">Couldn't load the menu: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-green-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-1">Today at Phelps</h1>
        <p className="text-green-300 mb-8">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
          })}
        </p>

        {(!offerings || offerings.length === 0) && (
          <p className="text-green-400">
            No menu posted for today yet. Check back soon.
          </p>
        )}

        {PERIODS.map(period => {
          // All of today's offerings for this meal period
          const meal = offerings.filter(o => o.period === period)
          if (meal.length === 0) return null

          // Group them by station, keeping station sort order
          const stations = [...new Set(meal.map(o => o.station.name))]
            .sort((a, b) =>
              meal.find(o => o.station.name === a).station.sort_order -
              meal.find(o => o.station.name === b).station.sort_order
            )

          return (
            <section key={period} className="mb-10">
              <h2 className="text-2xl font-bold capitalize border-b border-green-800 pb-2 mb-4">
                {period}
              </h2>

              {stations.map(stationName => (
                <div key={stationName} className="mb-6">
                  <h3 className="text-green-400 font-semibold uppercase text-sm tracking-wide mb-2">
                    {stationName}
                  </h3>

                  <div className="space-y-2">
                    {meal
                      .filter(o => o.station.name === stationName)
                      .map(o => (
                        <div
                          key={o.item.id}
                          className="bg-green-900 border border-green-800 rounded-lg p-4 flex justify-between items-start"
                        >
                          <div>
                            <div className="font-semibold">
                              {o.item.name}
                              {o.item.is_vegan && (
                                <span className="ml-2 text-xs bg-green-400 text-green-950 rounded px-1.5 py-0.5 font-bold">VG</span>
                              )}
                              {!o.item.is_vegan && o.item.is_vegetarian && (
                                <span className="ml-2 text-xs bg-green-600 text-white rounded px-1.5 py-0.5 font-bold">V</span>
                              )}
                            </div>
                            <div className="text-green-400 text-sm">{o.item.serving_label}</div>
                            {o.item.allergens.length > 0 && (
                              <div className="text-yellow-500 text-xs mt-1">
                                Contains: {o.item.allergens.join(', ')}
                              </div>
                            )}
                          </div>

                          <div className="text-right text-sm shrink-0 ml-4">
                            <div className="font-bold text-green-300">{o.item.calories} cal</div>
                            <div className="text-green-500">
                              P {o.item.protein_g} · C {o.item.carbs_g} · F {o.item.fat_g}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </section>
          )
        })}

      </div>
    </main>
  )
}