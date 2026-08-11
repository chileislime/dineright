/**
 * DineRight — USDA Nutrition Lookup  (v2)
 * ---------------------------------------------------------------
 * Looks up each menu item in USDA FoodData Central, shows you the
 * candidate matches, and lets you pick the right one and the right
 * portion. Saves the FDC ID so every number traces to a real record.
 *
 * RUN IT:   node scripts/fetch-nutrition.js
 *
 * NEW IN v2:
 *  - Shows a portion size cheat sheet at every grams prompt
 *  - Warns if a portion looks too small or too large
 *  - Shows the resulting macros and asks you to confirm before saving
 *  - Prints the item name loudly so you always know what you're on
 *
 * Progress saves after every item — Ctrl+C anytime, rerun to resume.
 * ---------------------------------------------------------------
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// ---------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------
function getApiKey() {
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
    const match = env.match(/^USDA_API_KEY=(.+)$/m)
    if (match) return match[1].trim()
  } catch (e) { /* fall through */ }
  console.log('\nNo USDA_API_KEY in .env.local — using DEMO_KEY (rate limited).')
  console.log('Free key: https://api.data.gov/signup/\n')
  return 'DEMO_KEY'
}

const API_KEY = getApiKey()
const BASE = 'https://api.nal.usda.gov/fdc/v1'
const OUTPUT = path.join(__dirname, 'nutrition-data.json')
const NUTRIENT = { calories: 1008, protein: 1003, carbs: 1005, fat: 1004 }

// Sanity thresholds — anything outside these gets a warning
const MIN_REASONABLE_GRAMS = 40
const MAX_REASONABLE_GRAMS = 500

const PORTION_GUIDE = `
  ---- PORTION CHEAT SHEET (grams) ----
  Entree scoop (saucy dish, casserole) ... 200-250
  Meat portion, 4 oz (chicken breast) .... 115
  Rice / pasta / mashed potato, 1 cup .... 150-200
  Cooked vegetables, 1/2 cup ............. 75-85
  Soup, 1 cup ladle ...................... 240
  Sauce or dressing, 2 tbsp .............. 30
  Bread slice or bun ..................... 40-60
  One egg ................................ 50
  Yogurt cup ............................. 150-170
  Rule of thumb: 1 cup = ~200g, 1/2 cup = ~100g
  -------------------------------------`

// ---------------------------------------------------------------
// MENU ITEMS
// ---------------------------------------------------------------
const ITEMS = [
  'Orange Chicken with Broccoli',
  'White Rice',
  'Vegetable Spring Rolls',
  'Lemon Green Beans',
  'Sweet & Sour Sauce',
  'Beef Hot Dogs',
  'Hot Dog Buns',
  'Baked Potatoes',
  'Roasted Chicken',
  'Cheese Tortellini',
  'Sliced Italian Sausage',
  'Sliced Grilled Chicken',
  'Alfredo Sauce',
  'Garlic Toast',
  'California Blend',
  'Corn Spaghetti',
  'Marinara Sauce',
  'Roasted Sweet Potatoes',
  'Herb Pork Loin',
  'Scrambled Eggs',
  'Pork Sausage Patties',
  'Roasted Diced Redskin Potatoes',
  'Cinnamon Rolls',
  'Assorted Yogurt',
  'Assorted Fruit',
  'Oatmeal',
  'Plant Based Sausage Patties',
  'Bacon Burgers',
  'Beef Burgers',
  'Hamburger Buns',
  'Bacon',
  'Waffle Fries',
  'Honey Roasted Rainbow Carrots',
  'Pasta',
  'Red Sauce',
  'Parmesan Cheese',
  'Teriyaki Chicken',
  'Beef & Broccoli Lo Mein',
  'Pork Egg Rolls',
  'Zucchini, Squash, Red Pepper & Carrots',
  'Spicy Kale Tofu Bowl',
  'Brown Rice',
]

// Better search terms for names USDA won't recognize
const SEARCH_OVERRIDES = {
  'White Rice': 'rice white long-grain cooked',
  'Vegetable Spring Rolls': 'spring roll vegetable',
  'California Blend': 'broccoli cauliflower carrots cooked',
  'Red Sauce': 'tomato sauce',
  'Assorted Fruit': 'fruit salad fresh',
  'Assorted Yogurt': 'yogurt lowfat fruit',
  'Zucchini, Squash, Red Pepper & Carrots': 'mixed vegetables cooked',
  'Spicy Kale Tofu Bowl': 'tofu vegetables stir fried',
  'Herb Pork Loin': 'pork loin roasted',
  'Roasted Diced Redskin Potatoes': 'potato roasted',
  'Plant Based Sausage Patties': 'meatless sausage patty',
  'Lemon Green Beans': 'green beans cooked',
  'Corn Spaghetti': 'pasta corn cooked',
  'Sliced Grilled Chicken': 'chicken breast grilled',
  'Beef & Broccoli Lo Mein': 'lo mein beef',
  'Honey Roasted Rainbow Carrots': 'carrots cooked glazed',
}

// ---------------------------------------------------------------
// API
// ---------------------------------------------------------------
async function searchFoods(query) {
  const url = `${BASE}/foods/search?query=${encodeURIComponent(query)}`
    + `&dataType=${encodeURIComponent('Survey (FNDDS),SR Legacy')}`
    + `&pageSize=6&api_key=${API_KEY}`
  const res = await fetch(url)
  if (res.status === 429) {
    console.log('\nRate limit hit. Wait an hour or get a free key: https://api.data.gov/signup/')
    process.exit(1)
  }
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return (await res.json()).foods || []
}

async function getFoodDetail(fdcId) {
  const res = await fetch(`${BASE}/food/${fdcId}?api_key=${API_KEY}`)
  if (!res.ok) throw new Error(`Detail failed: ${res.status}`)
  return res.json()
}

function macrosPer100g(food) {
  const out = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  for (const n of food.foodNutrients || []) {
    const id = n.nutrientId ?? n.nutrient?.id
    const amount = n.value ?? n.amount ?? 0
    for (const [key, wanted] of Object.entries(NUTRIENT)) {
      if (id === wanted) out[key] = amount
    }
  }
  return out
}

// ---------------------------------------------------------------
// PROMPTS
// ---------------------------------------------------------------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = q => new Promise(resolve => rl.question(q, resolve))

// ---------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------
async function main() {
  let results = {}
  if (fs.existsSync(OUTPUT)) {
    results = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'))
    console.log(`Resuming — ${Object.keys(results).length} items already saved.`)
  }

  const todo = ITEMS.filter(name => !results[name])
  console.log(`\n${todo.length} items left.`)
  console.log('Number = pick that match | "s" = skip | "r" = new search term\n')

  for (const name of todo) {
    let query = SEARCH_OVERRIDES[name] || name
    let saved = false

    // Loop until this item is saved or skipped
    while (!saved) {
      let picked = null

      // ---- STEP 1: pick a USDA food ----
      while (!picked) {
        console.log('\n' + '#'.repeat(64))
        console.log(`#  NOW MATCHING:  ${name.toUpperCase()}`)
        console.log('#'.repeat(64))
        console.log(`Searching USDA for: "${query}"\n`)

        let foods
        try {
          foods = await searchFoods(query)
        } catch (e) {
          console.log(`Search error: ${e.message}`)
          break
        }

        if (foods.length === 0) {
          console.log('No matches. Try different words.')
        } else {
          foods.forEach((f, i) => {
            const m = macrosPer100g(f)
            console.log(`  [${i + 1}] ${f.description}`)
            console.log(`      ${f.dataType} · FDC ${f.fdcId}`)
            console.log(`      per 100g: ${Math.round(m.calories)} cal · `
              + `P ${m.protein.toFixed(1)} · C ${m.carbs.toFixed(1)} · F ${m.fat.toFixed(1)}\n`)
          })
        }

        const answer = (await ask(`[${name}] Pick #, "s" skip, "r" re-search: `)).trim().toLowerCase()
        if (answer === 's') { console.log('Skipped.\n'); saved = true; break }
        if (answer === 'r') { query = (await ask('New search term: ')).trim(); continue }

        const idx = parseInt(answer, 10) - 1
        if (isNaN(idx) || !foods[idx]) { console.log('Not a valid choice.\n'); continue }
        picked = foods[idx]
      }

      if (saved) break        // user skipped
      if (!picked) break      // search errored

      // ---- STEP 2: pick a portion ----
      const detail = await getFoodDetail(picked.fdcId)
      const per100 = macrosPer100g(detail)
      const portions = detail.foodPortions || []

      console.log(`\nMatched: ${picked.description}`)
      console.log(`How much of this is one serving of "${name}"?\n`)

      portions.forEach((p, i) => {
        const label = p.portionDescription || p.modifier || 'portion'
        console.log(`  [${i + 1}] ${label} — ${p.gramWeight}g`)
      })
      if (portions.length === 0) console.log('  (USDA lists no standard portions for this item)')
      console.log(`  [g] type grams myself`)
      console.log(PORTION_GUIDE)

      let grams = null
      while (grams === null) {
        const a = (await ask('Portion # or "g": ')).trim().toLowerCase()
        if (a === 'g') {
          const typed = parseFloat(await ask('Grams: '))
          if (!isNaN(typed) && typed > 0) grams = typed
        } else {
          const i = parseInt(a, 10) - 1
          if (portions[i]) grams = portions[i].gramWeight
        }
        if (grams === null) console.log('Not a valid choice.')

        // ---- SANITY CHECK ----
        if (grams !== null && grams < MIN_REASONABLE_GRAMS) {
          console.log(`\n  !! ${grams}g is very small — about a tablespoon or two.`)
          console.log(`  !! That's right for a sauce or condiment, but too small for`)
          console.log(`  !! an entree, side, or anything served with a scoop.`)
          const ok = (await ask('  Keep it anyway? (y/n): ')).trim().toLowerCase()
          if (ok !== 'y') grams = null
        } else if (grams !== null && grams > MAX_REASONABLE_GRAMS) {
          console.log(`\n  !! ${grams}g is over a pound of food — larger than a`)
          console.log(`  !! normal single serving.`)
          const ok = (await ask('  Keep it anyway? (y/n): ')).trim().toLowerCase()
          if (ok !== 'y') grams = null
        }
      }

      // ---- STEP 3: preview and confirm ----
      const scale = grams / 100
      const preview = {
        calories: Math.round(per100.calories * scale),
        protein_g: Math.round(per100.protein * scale * 10) / 10,
        carbs_g: Math.round(per100.carbs * scale * 10) / 10,
        fat_g: Math.round(per100.fat * scale * 10) / 10,
      }

      console.log(`\n  ${name} @ ${grams}g:`)
      console.log(`  ${preview.calories} cal · P ${preview.protein_g} · C ${preview.carbs_g} · F ${preview.fat_g}`)

      const confirm = (await ask('\n  Save this? (y = yes, n = redo this item): ')).trim().toLowerCase()
      if (confirm !== 'y') {
        console.log('  Starting this item over.\n')
        query = SEARCH_OVERRIDES[name] || name
        continue
      }

      const servingLabel = await ask('  Serving label students will see (e.g. "1 cup"): ')

      results[name] = {
        fdc_id: picked.fdcId,
        fdc_description: picked.description,
        serving_label: servingLabel.trim() || `${grams}g`,
        serving_grams: grams,
        ...preview,
      }

      fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2))
      console.log(`  Saved.\n`)
      saved = true
    }
  }

  rl.close()
  console.log(`\nDone. ${Object.keys(results).length} items in scripts/nutrition-data.json`)
  console.log('Next: node scripts/generate-sql.js')
}

main().catch(e => { console.error(e); rl.close() })