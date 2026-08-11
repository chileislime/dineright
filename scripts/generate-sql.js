/**
 * DineRight — Turn USDA lookups into SQL
 * ---------------------------------------------------------------
 * Reads scripts/nutrition-data.json (created by fetch-nutrition.js)
 * and writes scripts/nutrition-update.sql, which you paste into
 * the Supabase SQL Editor.
 *
 * RUN IT:   node scripts/generate-sql.js
 * ---------------------------------------------------------------
 */

const fs = require('fs')
const path = require('path')

const INPUT = path.join(__dirname, 'nutrition-data.json')
const OUTPUT = path.join(__dirname, 'nutrition-update.sql')

if (!fs.existsSync(INPUT)) {
  console.log('No nutrition-data.json found. Run: node scripts/fetch-nutrition.js')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'))
const escape = s => String(s).replace(/'/g, "''")

let sql = `-- DineRight — USDA-sourced macros
-- Generated ${new Date().toISOString().slice(0, 10)} from USDA FoodData Central
-- Every row includes the FDC ID it came from.

-- Add the source column if it isn't there yet
alter table menu_items add column if not exists fdc_id bigint;
alter table menu_items add column if not exists fdc_description text;

`

for (const [name, d] of Object.entries(data)) {
  sql += `-- ${name}  <-  ${d.fdc_description}\n`
  sql += `update menu_items set\n`
  sql += `  calories = ${d.calories},\n`
  sql += `  protein_g = ${d.protein_g},\n`
  sql += `  carbs_g = ${d.carbs_g},\n`
  sql += `  fat_g = ${d.fat_g},\n`
  sql += `  serving_label = '${escape(d.serving_label)}',\n`
  sql += `  fdc_id = ${d.fdc_id},\n`
  sql += `  fdc_description = '${escape(d.fdc_description)}'\n`
  sql += `where name = '${escape(name)}';\n\n`
}

sql += `-- Check: any items still missing a source?\n`
sql += `select name from menu_items where fdc_id is null order by name;\n`

fs.writeFileSync(OUTPUT, sql)
console.log(`Wrote ${Object.keys(data).length} updates to scripts/nutrition-update.sql`)
console.log('Open that file, copy it, paste into Supabase SQL Editor, and Run.')