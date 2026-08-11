-- DineRight — USDA-sourced macros
-- Generated 2026-08-11 from USDA FoodData Central
-- Every row includes the FDC ID it came from.

-- Add the source column if it isn't there yet
alter table menu_items add column if not exists fdc_id bigint;
alter table menu_items add column if not exists fdc_description text;

-- Orange Chicken with Broccoli  <-  Orange chicken
update menu_items set
  calories = 660,
  protein_g = 36.5,
  carbs_g = 56.7,
  fat_g = 32,
  serving_label = '1 cup',
  fdc_id = 2706443,
  fdc_description = 'Orange chicken'
where name = 'Orange Chicken with Broccoli';

-- White Rice  <-  Rice, white, long-grain, regular, enriched, cooked
update menu_items set
  calories = 205,
  protein_g = 4.3,
  carbs_g = 44.5,
  fat_g = 0.4,
  serving_label = '1 cup',
  fdc_id = 168878,
  fdc_description = 'Rice, white, long-grain, regular, enriched, cooked'
where name = 'White Rice';

-- Vegetable Spring Rolls  <-  Egg rolls, vegetable, frozen, prepared
update menu_items set
  calories = 146,
  protein_g = 4,
  carbs_g = 21.6,
  fat_g = 4.7,
  serving_label = '1 cup',
  fdc_id = 172105,
  fdc_description = 'Egg rolls, vegetable, frozen, prepared'
where name = 'Vegetable Spring Rolls';

-- Lemon Green Beans  <-  Green beans, canned, cooked with oil
update menu_items set
  calories = 73,
  protein_g = 1.5,
  carbs_g = 5.8,
  fat_g = 4.8,
  serving_label = '1 cup',
  fdc_id = 2709863,
  fdc_description = 'Green beans, canned, cooked with oil'
where name = 'Lemon Green Beans';

-- Sweet & Sour Sauce  <-  Beef with sweet and sour sauce
update menu_items set
  calories = 532,
  protein_g = 23.4,
  carbs_g = 35.8,
  fat_g = 32.3,
  serving_label = '1 cup',
  fdc_id = 2706392,
  fdc_description = 'Beef with sweet and sour sauce'
where name = 'Sweet & Sour Sauce';

-- Hot Dog Buns  <-  Roll, whole wheat, hot dog bun
update menu_items set
  calories = 121,
  protein_g = 5.6,
  carbs_g = 20.2,
  fat_g = 2,
  serving_label = '2 pieces',
  fdc_id = 2707750,
  fdc_description = 'Roll, whole wheat, hot dog bun'
where name = 'Hot Dog Buns';

-- Baked Potatoes  <-  Potato, baked, peel eaten
update menu_items set
  calories = 121,
  protein_g = 3.2,
  carbs_g = 27.3,
  fat_g = 0.2,
  serving_label = '1 cup',
  fdc_id = 2709524,
  fdc_description = 'Potato, baked, peel eaten'
where name = 'Baked Potatoes';

-- Cheese Tortellini  <-  Tortellini, cheese-filled, meatless, with tomato sauce, canned
update menu_items set
  calories = 225,
  protein_g = 8.6,
  carbs_g = 39.5,
  fat_g = 3.7,
  serving_label = '1 cup',
  fdc_id = 2708788,
  fdc_description = 'Tortellini, cheese-filled, meatless, with tomato sauce, canned'
where name = 'Cheese Tortellini';

-- Sliced Grilled Chicken  <-  Chicken, broiler or fryers, breast, skinless, boneless, meat only, cooked, grilled
update menu_items set
  calories = 296,
  protein_g = 59.9,
  carbs_g = 0,
  fat_g = 6.2,
  serving_label = '2 piece',
  fdc_id = 171534,
  fdc_description = 'Chicken, broiler or fryers, breast, skinless, boneless, meat only, cooked, grilled'
where name = 'Sliced Grilled Chicken';

-- Garlic Toast  <-  Cereal, cinnamon toast
update menu_items set
  calories = 166,
  protein_g = 2.4,
  carbs_g = 30.1,
  fat_g = 4,
  serving_label = '1 cup',
  fdc_id = 2708450,
  fdc_description = 'Cereal, cinnamon toast'
where name = 'Garlic Toast';

-- California Blend  <-  Broccoli and cauliflower, cooked, no added fat
update menu_items set
  calories = 36,
  protein_g = 3.6,
  carbs_g = 7,
  fat_g = 0.3,
  serving_label = '1 cup',
  fdc_id = 2710031,
  fdc_description = 'Broccoli and cauliflower, cooked, no added fat'
where name = 'California Blend';

-- Roasted Sweet Potatoes  <-  Sweet potato, candied
update menu_items set
  calories = 84,
  protein_g = 0.5,
  carbs_g = 17,
  fat_g = 1.6,
  serving_label = '1 piece',
  fdc_id = 2709704,
  fdc_description = 'Sweet potato, candied'
where name = 'Roasted Sweet Potatoes';

-- Scrambled Eggs  <-  Egg omelet or scrambled egg, made with oil
update menu_items set
  calories = 106,
  protein_g = 6.4,
  carbs_g = 0.5,
  fat_g = 8.7,
  serving_label = '1 cup',
  fdc_id = 2707200,
  fdc_description = 'Egg omelet or scrambled egg, made with oil'
where name = 'Scrambled Eggs';

-- Pork Sausage Patties  <-  Pork sausage, link/patty, cooked, pan-fried
update menu_items set
  calories = 88,
  protein_g = 5,
  carbs_g = 0.4,
  fat_g = 7.4,
  serving_label = '1 cup.',
  fdc_id = 174578,
  fdc_description = 'Pork sausage, link/patty, cooked, pan-fried'
where name = 'Pork Sausage Patties';

-- Cinnamon Rolls  <-  Roll, sweet, cinnamon bun, frosted
update menu_items set
  calories = 1085,
  protein_g = 10.7,
  carbs_g = 116.6,
  fat_g = 63.8,
  serving_label = '1 piece',
  fdc_id = 2707668,
  fdc_description = 'Roll, sweet, cinnamon bun, frosted'
where name = 'Cinnamon Rolls';

-- Assorted Fruit  <-  Fruit salad, including citrus fruits, with salad dressing or mayonnaise
update menu_items set
  calories = 451,
  protein_g = 3.5,
  carbs_g = 24.4,
  fat_g = 38.2,
  serving_label = '1 cup',
  fdc_id = 2709302,
  fdc_description = 'Fruit salad, including citrus fruits, with salad dressing or mayonnaise'
where name = 'Assorted Fruit';

-- Oatmeal  <-  Bread, oatmeal
update menu_items set
  calories = 73,
  protein_g = 2.3,
  carbs_g = 13.1,
  fat_g = 1.2,
  serving_label = '1 cup',
  fdc_id = 172678,
  fdc_description = 'Bread, oatmeal'
where name = 'Oatmeal';

-- Plant Based Sausage Patties  <-  Bacon, meatless
update menu_items set
  calories = 15,
  protein_g = 0.6,
  carbs_g = 0.3,
  fat_g = 1.5,
  serving_label = '3 strips',
  fdc_id = 172439,
  fdc_description = 'Bacon, meatless'
where name = 'Plant Based Sausage Patties';

-- Waffle Fries  <-  Waffle, NFS
update menu_items set
  calories = 417,
  protein_g = 10,
  carbs_g = 65.3,
  fat_g = 12.8,
  serving_label = '1 piece',
  fdc_id = 2708312,
  fdc_description = 'Waffle, NFS'
where name = 'Waffle Fries';

-- Pasta  <-  Pasta, cooked
update menu_items set
  calories = 220,
  protein_g = 8.1,
  carbs_g = 43,
  fat_g = 1.3,
  serving_label = '1 cup',
  fdc_id = 2708357,
  fdc_description = 'Pasta, cooked'
where name = 'Pasta';

-- Parmesan Cheese  <-  Cheese, parmesan, grated
update menu_items set
  calories = 119,
  protein_g = 8.1,
  carbs_g = 3.9,
  fat_g = 7.9,
  serving_label = '1 cup',
  fdc_id = 171247,
  fdc_description = 'Cheese, parmesan, grated'
where name = 'Parmesan Cheese';

-- Teriyaki Chicken  <-  Teriyaki chicken with rice and vegetable, diet frozen meal
update menu_items set
  calories = 393,
  protein_g = 17.6,
  carbs_g = 70.2,
  fat_g = 4.9,
  serving_label = '1 cup',
  fdc_id = 2707109,
  fdc_description = 'Teriyaki chicken with rice and vegetable, diet frozen meal'
where name = 'Teriyaki Chicken';

-- Beef & Broccoli Lo Mein  <-  Lo mein, with beef
update menu_items set
  calories = 258,
  protein_g = 19.5,
  carbs_g = 32.4,
  fat_g = 5.5,
  serving_label = '1 cup',
  fdc_id = 2708802,
  fdc_description = 'Lo mein, with beef'
where name = 'Beef & Broccoli Lo Mein';

-- Zucchini, Squash, Red Pepper & Carrots  <-  Classic mixed vegetables, NS as to form, cooked
update menu_items set
  calories = 159,
  protein_g = 5.1,
  carbs_g = 23.5,
  fat_g = 5,
  serving_label = '1 cup',
  fdc_id = 2710015,
  fdc_description = 'Classic mixed vegetables, NS as to form, cooked'
where name = 'Zucchini, Squash, Red Pepper & Carrots';

-- Spicy Kale Tofu Bowl  <-  Stir fried beef and vegetables in soy sauce
update menu_items set
  calories = 165,
  protein_g = 17.3,
  carbs_g = 7.2,
  fat_g = 7.8,
  serving_label = '1 cup',
  fdc_id = 2706751,
  fdc_description = 'Stir fried beef and vegetables in soy sauce'
where name = 'Spicy Kale Tofu Bowl';

-- Brown Rice  <-  Snacks, rice cakes, brown rice, multigrain
update menu_items set
  calories = 35,
  protein_g = 0.8,
  carbs_g = 7.2,
  fat_g = 0.3,
  serving_label = '1 cup',
  fdc_id = 169680,
  fdc_description = 'Snacks, rice cakes, brown rice, multigrain'
where name = 'Brown Rice';

-- Check: any items still missing a source?
select name from menu_items where fdc_id is null order by name;
