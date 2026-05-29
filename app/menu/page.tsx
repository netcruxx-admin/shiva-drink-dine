"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type OrderType = "dine-in" | "pickup";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  orderType: OrderType;
  time: string;
}

const CATEGORIES = [
  "Breakfast",
  "Snacks & Starters",
  "Pizza",
  "Eggs",
  "Sandwich",
  "Pasta",
  "Soups",
  "South Indian",
  "Siddu",
  "Momo",
  "Raita",
  "Salad",
  "Burgers",
  "Wrap",
  "Indian Main Course",
  "Chinese",
  "Tandoori",
  "Rice",
  "Thalis",
  "Roti",
  "Desserts",
  "Beer & Breezer",
  "Rum",
  "Vodka",
  "Whisky & Scotch",
  "Cocktails",
  "Mocktails",
  "Cold Drinks",
  "Tea & Coffee",
  "Shakes",
];

const MENU_ITEMS: MenuItem[] = [
  // Breakfast — Veg
  { id: 1, name: "Plain Prantha", description: "Classic plain wheat prantha served with butter and pickle", price: 43, category: "Breakfast", isVeg: true },
  { id: 2, name: "Aloo Prantha", description: "Wheat prantha stuffed with spiced mashed potato", price: 53, category: "Breakfast", isVeg: true },
  { id: 3, name: "Onion Prantha", description: "Wheat prantha stuffed with seasoned onion filling", price: 63, category: "Breakfast", isVeg: true },
  { id: 4, name: "Aloo Pyaz Prantha", description: "Wheat prantha stuffed with potato and onion mix", price: 63, category: "Breakfast", isVeg: true },
  { id: 5, name: "Gobhi Prantha", description: "Wheat prantha stuffed with spiced cauliflower", price: 73, category: "Breakfast", isVeg: true },
  { id: 6, name: "Mix Prantha", description: "Wheat prantha with a mixed vegetable filling", price: 83, category: "Breakfast", isVeg: true },
  { id: 7, name: "Paneer Prantha", description: "Wheat prantha stuffed with crumbled cottage cheese and spices", price: 93, category: "Breakfast", isVeg: true },
  { id: 8, name: "Poha", description: "Flattened rice cooked with onions, mustard seeds and herbs", price: 103, category: "Breakfast", isVeg: true },
  { id: 9, name: "Chana Bhatura", description: "Fluffy fried bread served with spiced chickpea curry", price: 103, category: "Breakfast", isVeg: true },
  { id: 10, name: "Amritsari Naan", description: "Soft Amritsari-style naan baked in tandoor", price: 103, category: "Breakfast", isVeg: true },
  { id: 11, name: "Puri Bhaji", description: "Deep fried puris served with spiced potato bhaji", price: 93, category: "Breakfast", isVeg: true },
  { id: 12, name: "Plain Toast", description: "Toasted bread slices served plain", price: 33, category: "Breakfast", isVeg: true },
  { id: 13, name: "Butter Toast", description: "Toasted bread slices served with butter", price: 73, category: "Breakfast", isVeg: true },
  { id: 14, name: "Extra Cholle", description: "Extra serving of spiced chickpea curry", price: 33, category: "Breakfast", isVeg: true },
  { id: 15, name: "Extra Bhature", description: "Extra piece of fried bhatura", price: 43, category: "Breakfast", isVeg: true },
  // Breakfast — Non-Veg
  { id: 16, name: "Egg Prantha", description: "Wheat prantha stuffed with spiced egg", price: 103, category: "Breakfast", isVeg: false },
  { id: 17, name: "French Toast", description: "Egg-dipped bread slices pan-fried golden brown", price: 83, category: "Breakfast", isVeg: false },

  // Snacks & Starters — Veg
  { id: 18, name: "Cheese Ball", description: "Crispy fried cheese balls with a gooey centre", price: 253, category: "Snacks & Starters", isVeg: true },
  { id: 19, name: "Crispy Corn", description: "Crunchy corn kernels tossed with spices and herbs", price: 223, category: "Snacks & Starters", isVeg: true },
  { id: 20, name: "Chana Chaat", description: "Tangy spiced chickpea chaat with chutneys", price: 123, category: "Snacks & Starters", isVeg: true },
  { id: 21, name: "Corn Chaat", description: "Sweet corn tossed with lemon, spices and sev", price: 193, category: "Snacks & Starters", isVeg: true },
  { id: 22, name: "Peanut Masala", description: "Roasted peanuts tossed with onion, tomato and spices", price: 123, category: "Snacks & Starters", isVeg: true },
  { id: 23, name: "Aloo Chana Chaat", description: "Potato and chickpea chaat with tangy chutneys", price: 133, category: "Snacks & Starters", isVeg: true },
  { id: 24, name: "French Fries", description: "Golden crispy potato fries served with ketchup", price: 103, category: "Snacks & Starters", isVeg: true },
  { id: 25, name: "Peri Peri Fries", description: "Crispy fries tossed in tangy peri peri seasoning", price: 143, category: "Snacks & Starters", isVeg: true },
  { id: 26, name: "Veg Fingers", description: "Crispy breaded vegetable fingers served with dip", price: 223, category: "Snacks & Starters", isVeg: true },
  { id: 27, name: "Cheese Finger", description: "Crispy cheese-filled finger snacks", price: 193, category: "Snacks & Starters", isVeg: true },
  { id: 28, name: "Veg Cocktail Kabab", description: "Mixed vegetable kababs with chutney", price: 203, category: "Snacks & Starters", isVeg: true },
  { id: 29, name: "Hara Bhara Kabab", description: "Spinach and pea patties pan-fried and served with mint chutney", price: 233, category: "Snacks & Starters", isVeg: true },
  { id: 30, name: "Papad (Roasted/Fried)", description: "Crispy papad, choice of roasted or fried", price: 33, category: "Snacks & Starters", isVeg: true },
  { id: 31, name: "Masala Papad", description: "Papad topped with spiced onion-tomato mixture", price: 53, category: "Snacks & Starters", isVeg: true },
  { id: 32, name: "Veg Pakoda", description: "Assorted vegetables dipped in spiced gram flour batter and fried", price: 183, category: "Snacks & Starters", isVeg: true },
  { id: 33, name: "Paneer Pakoda", description: "Cottage cheese pieces in spiced gram flour batter, deep fried", price: 203, category: "Snacks & Starters", isVeg: true },
  { id: 34, name: "Fruit Chaat", description: "Fresh seasonal fruits with chaat masala and lemon", price: 183, category: "Snacks & Starters", isVeg: true },
  // Snacks & Starters — Non-Veg
  { id: 35, name: "Chicken Finger", description: "Crispy breaded chicken fingers served with dip", price: 273, category: "Snacks & Starters", isVeg: false },
  { id: 36, name: "Chicken Kurkura", description: "Crunchy spiced chicken — Half ₹323 | Full ₹523", price: 323, category: "Snacks & Starters", isVeg: false },
  { id: 37, name: "Fried Chicken", description: "Golden fried chicken — Half ₹303 | Full ₹493", price: 303, category: "Snacks & Starters", isVeg: false },
  { id: 38, name: "Chicken Pakoda", description: "Chicken pieces coated in spiced gram flour batter and fried", price: 293, category: "Snacks & Starters", isVeg: false },

  // Pizza — Veg
  { id: 39, name: "Veg Pizza", description: "Classic pizza loaded with fresh vegetables", price: 203, category: "Pizza", isVeg: true },
  { id: 40, name: "Margherita Pizza", description: "Classic tomato sauce and mozzarella pizza", price: 223, category: "Pizza", isVeg: true },
  { id: 41, name: "Mushroom Pizza", description: "Pizza topped with sautéed mushrooms and cheese", price: 233, category: "Pizza", isVeg: true },
  { id: 42, name: "Cheese Corn Pizza", description: "Pizza loaded with sweet corn and extra cheese", price: 233, category: "Pizza", isVeg: true },
  { id: 43, name: "Capsicum Pizza", description: "Pizza with colourful bell peppers and cheese", price: 173, category: "Pizza", isVeg: true },
  { id: 44, name: "Onion Capsicum Pizza", description: "Pizza with onion, capsicum and cheese", price: 183, category: "Pizza", isVeg: true },
  { id: 45, name: "Special Pizza", description: "Chef's special pizza with a mix of premium toppings", price: 253, category: "Pizza", isVeg: true },
  // Pizza — Non-Veg
  { id: 46, name: "Chicken Pizza", description: "Pizza topped with seasoned chicken pieces and cheese", price: 273, category: "Pizza", isVeg: false },

  // Eggs — Non-Veg
  { id: 47, name: "Boiled Egg", description: "Freshly boiled egg", price: 53, category: "Eggs", isVeg: false },
  { id: 48, name: "Scrambled Egg", description: "Soft and creamy scrambled eggs", price: 73, category: "Eggs", isVeg: false },
  { id: 49, name: "Egg Pakoda", description: "Egg pieces in spiced gram flour batter, fried crispy", price: 73, category: "Eggs", isVeg: false },
  { id: 50, name: "Half Fried Egg", description: "Sunny-side-up egg with runny yolk", price: 63, category: "Eggs", isVeg: false },
  { id: 51, name: "Plain Omelette", description: "Simple egg omelette cooked on tawa", price: 53, category: "Eggs", isVeg: false },
  { id: 52, name: "Plain Omelette with Slice", description: "Plain omelette served with bread slice", price: 63, category: "Eggs", isVeg: false },
  { id: 53, name: "Masala Omelette", description: "Spiced omelette with onion, tomato and green chilli", price: 83, category: "Eggs", isVeg: false },
  { id: 54, name: "Masala Omelette with Slice", description: "Masala omelette served with bread slice", price: 93, category: "Eggs", isVeg: false },
  { id: 55, name: "Cheese Omelette", description: "Fluffy omelette filled with melted cheese", price: 103, category: "Eggs", isVeg: false },
  { id: 56, name: "Cheese Omelette with Slice", description: "Cheese omelette served with bread slice", price: 113, category: "Eggs", isVeg: false },
  { id: 57, name: "Egg Bhurji", description: "Scrambled egg cooked with onion, tomato and spices", price: 83, category: "Eggs", isVeg: false },

  // Sandwich — Veg
  { id: 58, name: "Veg Sandwich Plain", description: "Fresh vegetable sandwich on soft bread", price: 83, category: "Sandwich", isVeg: true },
  { id: 59, name: "Veg Grilled Sandwich", description: "Grilled vegetable sandwich with green chutney", price: 103, category: "Sandwich", isVeg: true },
  { id: 60, name: "Cheese Grilled Sandwich", description: "Grilled sandwich loaded with melted cheese", price: 143, category: "Sandwich", isVeg: true },
  { id: 61, name: "Veg Club Sandwich", description: "Triple-decker vegetable club sandwich", price: 193, category: "Sandwich", isVeg: true },
  { id: 62, name: "Corn Specialty Grilled", description: "Grilled sandwich with sweet corn and cheese", price: 153, category: "Sandwich", isVeg: true },
  { id: 63, name: "Cheese Sandwich", description: "Sandwich filled with cheese slices", price: 103, category: "Sandwich", isVeg: true },
  // Sandwich — Non-Veg
  { id: 64, name: "Egg Sandwich", description: "Sandwich filled with egg and spiced filling", price: 133, category: "Sandwich", isVeg: false },
  { id: 65, name: "Chicken Sandwich", description: "Sandwich with seasoned chicken filling", price: 153, category: "Sandwich", isVeg: false },
  { id: 66, name: "Chicken Club Sandwich", description: "Triple-decker club sandwich with chicken", price: 223, category: "Sandwich", isVeg: false },

  // Pasta — Veg
  { id: 67, name: "Red Sauce Pasta", description: "Pasta in classic tomato-based red sauce", price: 243, category: "Pasta", isVeg: true },
  { id: 68, name: "White Sauce Pasta", description: "Pasta in creamy béchamel white sauce", price: 273, category: "Pasta", isVeg: true },
  { id: 69, name: "Mix Sauce Pasta", description: "Pasta in a blend of red and white sauces", price: 253, category: "Pasta", isVeg: true },
  // Pasta — Non-Veg
  { id: 70, name: "Chicken Red Pasta", description: "Pasta with chicken in spiced tomato red sauce", price: 313, category: "Pasta", isVeg: false },
  { id: 71, name: "Chicken White Pasta", description: "Pasta with chicken in creamy white sauce", price: 333, category: "Pasta", isVeg: false },

  // Soups — Veg
  { id: 72, name: "Veg Clear Soup", description: "Light clear vegetable broth with herbs", price: 43, category: "Soups", isVeg: true },
  { id: 73, name: "Veg Soup", description: "Hearty mixed vegetable soup", price: 63, category: "Soups", isVeg: true },
  { id: 74, name: "Tomato Soup", description: "Creamy fresh tomato soup with herbs", price: 73, category: "Soups", isVeg: true },
  { id: 75, name: "Veg Hot N Sour", description: "Tangy and spicy vegetable hot & sour soup", price: 93, category: "Soups", isVeg: true },
  { id: 76, name: "Sweet Corn / Talumin / Lemon Coriander", description: "Choice of sweet corn, talumein or lemon coriander soup", price: 103, category: "Soups", isVeg: true },
  { id: 77, name: "Veg Manchow", description: "Crispy noodle-topped spiced vegetable manchow soup", price: 113, category: "Soups", isVeg: true },
  { id: 78, name: "Cream of Tomato", description: "Velvety cream of tomato soup", price: 113, category: "Soups", isVeg: true },
  { id: 79, name: "Cream of Mushroom", description: "Rich and creamy mushroom soup", price: 123, category: "Soups", isVeg: true },
  // Soups — Non-Veg
  { id: 80, name: "Chicken Clear Soup", description: "Light chicken broth with vegetables", price: 113, category: "Soups", isVeg: false },
  { id: 81, name: "Chicken Soup", description: "Hearty chicken and vegetable soup", price: 133, category: "Soups", isVeg: false },
  { id: 82, name: "Chicken Talumein", description: "Noodle soup with chicken and vegetables", price: 133, category: "Soups", isVeg: false },
  { id: 83, name: "Chicken Hot N Sour", description: "Spicy and tangy chicken hot & sour soup", price: 153, category: "Soups", isVeg: false },
  { id: 84, name: "Chicken Manchow", description: "Crispy noodle-topped spiced chicken manchow soup", price: 163, category: "Soups", isVeg: false },

  // South Indian — Veg
  { id: 85, name: "Plain Dosa", description: "Thin crispy rice and lentil crepe served with sambar and chutney", price: 93, category: "South Indian", isVeg: true },
  { id: 86, name: "Onion Dosa", description: "Crispy dosa topped with seasoned onions", price: 133, category: "South Indian", isVeg: true },
  { id: 87, name: "Masala Dosa", description: "Crispy dosa filled with spiced potato masala", price: 123, category: "South Indian", isVeg: true },
  { id: 88, name: "Cheese Dosa", description: "Crispy dosa topped with melted cheese", price: 153, category: "South Indian", isVeg: true },
  { id: 89, name: "Uttapam", description: "Thick rice pancake topped with onion, tomato and vegetables", price: 173, category: "South Indian", isVeg: true },
  { id: 90, name: "Idli Sambar", description: "Steamed rice cakes served with sambar and coconut chutney", price: 103, category: "South Indian", isVeg: true },
  { id: 91, name: "Extra Sambar", description: "Additional serving of sambar", price: 33, category: "South Indian", isVeg: true },
  // South Indian — Non-Veg
  { id: 92, name: "Egg Dosa", description: "Crispy dosa with egg filling", price: 183, category: "South Indian", isVeg: false },
  { id: 93, name: "Mutton Keema Dosa", description: "Crispy dosa filled with spiced mutton keema", price: 263, category: "South Indian", isVeg: false },
  { id: 94, name: "Chicken Keema Dosa", description: "Crispy dosa filled with spiced chicken keema", price: 243, category: "South Indian", isVeg: false },

  // Siddu — Veg
  { id: 95, name: "Dal Siddu", description: "Traditional Himachali steamed bread with lentil stuffing", price: 103, category: "Siddu", isVeg: true },
  { id: 96, name: "Dry Fruit Siddu", description: "Traditional Himachali steamed bread stuffed with dry fruits", price: 123, category: "Siddu", isVeg: true },

  // Momo — Veg
  { id: 97, name: "Veg Momo", description: "Steamed vegetable dumplings — Half ₹63 | Full ₹93", price: 63, category: "Momo", isVeg: true },
  { id: 98, name: "Veg Fried Momo", description: "Pan-fried vegetable dumplings — Half ₹73 | Full ₹113", price: 73, category: "Momo", isVeg: true },
  { id: 99, name: "Veg Crunchy Momo", description: "Crispy fried vegetable dumplings", price: 153, category: "Momo", isVeg: true },
  { id: 100, name: "Chilli Veg Momo", description: "Steamed veg momos tossed in spicy chilli sauce", price: 193, category: "Momo", isVeg: true },
  // Momo — Non-Veg
  { id: 101, name: "Chicken Momo", description: "Steamed chicken dumplings — Half ₹103 | Full ₹173", price: 103, category: "Momo", isVeg: false },
  { id: 102, name: "Chicken Fried Momo", description: "Pan-fried chicken dumplings — Half ₹113 | Full ₹193", price: 113, category: "Momo", isVeg: false },
  { id: 103, name: "Chicken Crunchy Momo", description: "Crispy deep-fried chicken dumplings", price: 213, category: "Momo", isVeg: false },
  { id: 104, name: "Chilli Chicken Momo", description: "Chicken momos tossed in spicy chilli sauce", price: 253, category: "Momo", isVeg: false },
  { id: 105, name: "Mutton Momo", description: "Steamed mutton dumplings — Half ₹133 | Full ₹223", price: 133, category: "Momo", isVeg: false },

  // Raita — Veg
  { id: 106, name: "Veg Raita", description: "Chilled yogurt with fresh vegetables", price: 93, category: "Raita", isVeg: true },
  { id: 107, name: "Boondi Raita", description: "Chilled yogurt with crispy boondi", price: 73, category: "Raita", isVeg: true },
  { id: 108, name: "Zeera Raita", description: "Yogurt seasoned with roasted cumin", price: 63, category: "Raita", isVeg: true },
  { id: 109, name: "Pineapple Raita", description: "Chilled yogurt with sweet pineapple chunks", price: 163, category: "Raita", isVeg: true },
  { id: 110, name: "Mint Raita", description: "Refreshing yogurt with fresh mint", price: 103, category: "Raita", isVeg: true },
  { id: 111, name: "Potato Raita", description: "Yogurt with boiled spiced potato", price: 83, category: "Raita", isVeg: true },
  { id: 112, name: "Plain Curd", description: "Fresh plain set curd", price: 63, category: "Raita", isVeg: true },

  // Salad — Veg
  { id: 113, name: "Green Salad", description: "Fresh cucumber, tomato and lettuce salad", price: 93, category: "Salad", isVeg: true },
  { id: 114, name: "Onion Salad", description: "Sliced onions with lemon and spices", price: 73, category: "Salad", isVeg: true },
  { id: 115, name: "Cucumber Salad", description: "Sliced cucumber with lemon and chaat masala", price: 83, category: "Salad", isVeg: true },
  { id: 116, name: "Kuchumber Salad", description: "Chopped onion, tomato and cucumber salad", price: 123, category: "Salad", isVeg: true },
  { id: 117, name: "Russian Salad", description: "Mixed boiled vegetables in creamy dressing", price: 233, category: "Salad", isVeg: true },
  { id: 118, name: "Kangri Dham (Special)", description: "Traditional Himachali festive thali — available Saturday & Sunday only", price: 253, category: "Salad", isVeg: true },
  // Salad — Non-Veg
  { id: 119, name: "Egg Salad", description: "Sliced boiled egg with fresh vegetables", price: 153, category: "Salad", isVeg: false },

  // Burgers — Veg
  { id: 120, name: "Veg Burger", description: "Classic burger with spiced veg patty and toppings", price: 73, category: "Burgers", isVeg: true },
  { id: 121, name: "Cheese Burger", description: "Veg burger loaded with melted cheese", price: 93, category: "Burgers", isVeg: true },
  { id: 122, name: "Crispy Paneer Burger", description: "Burger with crispy paneer patty and sauce", price: 123, category: "Burgers", isVeg: true },
  // Burgers — Non-Veg
  { id: 123, name: "Egg Burger", description: "Burger with egg patty and fresh toppings", price: 113, category: "Burgers", isVeg: false },
  { id: 124, name: "Chicken Burger", description: "Burger with juicy spiced chicken patty", price: 133, category: "Burgers", isVeg: false },

  // Wrap — Veg
  { id: 125, name: "Veg Wrap", description: "Soft wrap with spiced vegetable filling", price: 103, category: "Wrap", isVeg: true },
  { id: 126, name: "Cheese Wrap", description: "Wrap filled with vegetables and melted cheese", price: 133, category: "Wrap", isVeg: true },
  // Wrap — Non-Veg
  { id: 127, name: "Egg Wrap", description: "Soft wrap with spiced egg filling", price: 123, category: "Wrap", isVeg: false },
  { id: 128, name: "Chicken Wrap", description: "Wrap with seasoned chicken and chutneys", price: 143, category: "Wrap", isVeg: false },
  { id: 129, name: "Mutton Wrap", description: "Wrap with tender spiced mutton filling", price: 163, category: "Wrap", isVeg: false },

  // Indian Main Course — Veg
  { id: 130, name: "Yellow Dal Fry", description: "Tempered yellow lentils with onion and tomato", price: 133, category: "Indian Main Course", isVeg: true },
  { id: 131, name: "Yellow/Black Dal Tadka", description: "Yellow or black lentils with a smoky tadka", price: 153, category: "Indian Main Course", isVeg: true },
  { id: 132, name: "Dal Makhni", description: "Slow-cooked black lentils in creamy tomato gravy", price: 203, category: "Indian Main Course", isVeg: true },
  { id: 133, name: "Rajmah Masala", description: "Red kidney beans in a rich spiced gravy", price: 203, category: "Indian Main Course", isVeg: true },
  { id: 134, name: "Matar Paneer", description: "Cottage cheese and green peas in tomato gravy", price: 213, category: "Indian Main Course", isVeg: true },
  { id: 135, name: "Shahi Paneer", description: "Paneer in a royal creamy cashew and tomato gravy", price: 253, category: "Indian Main Course", isVeg: true },
  { id: 136, name: "Kadai Paneer", description: "Paneer cooked with peppers in a kadai masala", price: 243, category: "Indian Main Course", isVeg: true },
  { id: 137, name: "Palak Paneer", description: "Cottage cheese in smooth spiced spinach gravy", price: 253, category: "Indian Main Course", isVeg: true },
  { id: 138, name: "Veg Kadai", description: "Mixed vegetables cooked in kadai masala", price: 223, category: "Indian Main Course", isVeg: true },
  { id: 139, name: "Veg Jal Frezi", description: "Stir-fried vegetables in a tangy spiced sauce", price: 223, category: "Indian Main Course", isVeg: true },
  { id: 140, name: "Veg Kolhapuri", description: "Fiery mixed vegetables in Kolhapuri masala", price: 223, category: "Indian Main Course", isVeg: true },
  { id: 141, name: "Rajmah", description: "Classic red kidney beans curry", price: 183, category: "Indian Main Course", isVeg: true },
  { id: 142, name: "Chana Masala", description: "Chickpeas cooked in a robust spiced gravy", price: 193, category: "Indian Main Course", isVeg: true },
  { id: 143, name: "Mushroom Matar", description: "Mushroom and peas in tomato-onion gravy", price: 203, category: "Indian Main Course", isVeg: true },
  { id: 144, name: "Mushroom Masala", description: "Mushrooms in a rich spiced masala gravy", price: 233, category: "Indian Main Course", isVeg: true },
  { id: 145, name: "Mushroom Do Pyaza", description: "Mushrooms with double onion in thick gravy", price: 233, category: "Indian Main Course", isVeg: true },
  { id: 146, name: "Kadai Mushroom", description: "Mushrooms cooked in kadai with peppers and spices", price: 243, category: "Indian Main Course", isVeg: true },
  { id: 147, name: "Veg Kofta", description: "Fried vegetable dumplings in spiced gravy", price: 193, category: "Indian Main Course", isVeg: true },
  { id: 148, name: "Cheese Tomato", description: "Cheese cubes in a tangy tomato gravy", price: 233, category: "Indian Main Course", isVeg: true },
  { id: 149, name: "Paneer Butter Masala", description: "Paneer in velvety tomato butter sauce", price: 263, category: "Indian Main Course", isVeg: true },
  { id: 150, name: "Paneer Do Pyaza", description: "Paneer with double onion in thick gravy", price: 253, category: "Indian Main Course", isVeg: true },
  { id: 151, name: "Paneer Lababdar", description: "Paneer in a lip-smacking onion-tomato gravy", price: 233, category: "Indian Main Course", isVeg: true },
  { id: 152, name: "Paneer Achari", description: "Paneer in a tangy pickling spice gravy", price: 303, category: "Indian Main Course", isVeg: true },
  { id: 153, name: "Paneer Tikka Lababdar", description: "Grilled paneer tikka in rich lababdar gravy", price: 333, category: "Indian Main Course", isVeg: true },
  { id: 154, name: "Paneer Bhurji", description: "Crumbled cottage cheese cooked with onion and spices", price: 183, category: "Indian Main Course", isVeg: true },
  { id: 155, name: "Mix Veg", description: "Seasonal mixed vegetables in spiced gravy", price: 223, category: "Indian Main Course", isVeg: true },
  { id: 156, name: "Malai Kofta", description: "Soft paneer and potato koftas in rich cream gravy", price: 303, category: "Indian Main Course", isVeg: true },
  { id: 157, name: "Navratna Korma", description: "Nine-ingredient vegetable and nut korma", price: 293, category: "Indian Main Course", isVeg: true },
  { id: 158, name: "Dum Aloo", description: "Baby potatoes slow-cooked in spiced gravy", price: 153, category: "Indian Main Course", isVeg: true },
  { id: 159, name: "Zeera Aloo", description: "Potatoes tempered with cumin and spices", price: 143, category: "Indian Main Course", isVeg: true },
  { id: 160, name: "Kashmiri Dum Aloo", description: "Baby potatoes in Kashmiri-style spiced gravy", price: 253, category: "Indian Main Course", isVeg: true },
  { id: 161, name: "Aloo Matar", description: "Potato and peas in tomato-onion gravy", price: 193, category: "Indian Main Course", isVeg: true },
  { id: 162, name: "Aloo Gobhi", description: "Potato and cauliflower stir-fried with spices", price: 233, category: "Indian Main Course", isVeg: true },
  { id: 163, name: "Kadhi Pakoda", description: "Gram flour fritters in tangy yogurt kadhi", price: 153, category: "Indian Main Course", isVeg: true },
  { id: 164, name: "Extra Gravy", description: "Extra portion of gravy", price: 93, category: "Indian Main Course", isVeg: true },
  // Indian Main Course — Non-Veg (4 Pieces)
  { id: 165, name: "Chicken Curry (4P)", description: "Chicken curry — 4 pieces portion", price: 213, category: "Indian Main Course", isVeg: false },
  { id: 166, name: "Chicken Rada (4P)", description: "Chicken rada — 4 pieces portion", price: 253, category: "Indian Main Course", isVeg: false },
  { id: 167, name: "Chicken Kadai (4P)", description: "Chicken kadai — 4 pieces portion", price: 263, category: "Indian Main Course", isVeg: false },
  { id: 168, name: "Handi Chicken (4P)", description: "Handi chicken — 4 pieces portion", price: 263, category: "Indian Main Course", isVeg: false },
  { id: 169, name: "Kolhapuri Chicken (4P)", description: "Spicy Kolhapuri chicken — 4 pieces portion", price: 223, category: "Indian Main Course", isVeg: false },
  { id: 170, name: "Chicken Rogan Josh (4P)", description: "Chicken rogan josh — 4 pieces portion", price: 273, category: "Indian Main Course", isVeg: false },
  { id: 171, name: "Muglai Chicken (4P)", description: "Rich Mughlai chicken — 4 pieces portion", price: 323, category: "Indian Main Course", isVeg: false },
  { id: 172, name: "Masala Chicken (4P)", description: "Spiced masala chicken — 4 pieces portion", price: 253, category: "Indian Main Course", isVeg: false },
  { id: 173, name: "Chicken Tikka Masala (4P)", description: "Chicken tikka masala — 4 pieces portion", price: 333, category: "Indian Main Course", isVeg: false },
  { id: 174, name: "Chicken Tikka Lababdar (4P)", description: "Chicken tikka lababdar — 4 pieces portion", price: 353, category: "Indian Main Course", isVeg: false },
  { id: 175, name: "Chicken Do Pyaza (4P)", description: "Chicken do pyaza — 4 pieces portion", price: 243, category: "Indian Main Course", isVeg: false },
  // Indian Main Course — Non-Veg (Half/Full)
  { id: 176, name: "Chicken Curry", description: "Classic chicken curry — Half ₹303 | Full ₹553", price: 303, category: "Indian Main Course", isVeg: false },
  { id: 177, name: "Egg Curry", description: "Eggs in spiced onion-tomato gravy", price: 163, category: "Indian Main Course", isVeg: false },
  { id: 178, name: "Chicken Rada", description: "Himachali-style chicken rada — Half ₹343 | Full ₹593", price: 343, category: "Indian Main Course", isVeg: false },
  { id: 179, name: "Butter Chicken", description: "Chicken in silky tomato-butter gravy — Half ₹393 | Full ₹633", price: 393, category: "Indian Main Course", isVeg: false },
  { id: 180, name: "Chicken Do Pyaza", description: "Chicken with double onion — Half ₹353 | Full ₹603", price: 353, category: "Indian Main Course", isVeg: false },
  { id: 181, name: "Chicken Kadai/Handi", description: "Kadai or handi chicken — Half ₹363 | Full ₹603", price: 363, category: "Indian Main Course", isVeg: false },
  { id: 182, name: "Chicken Rogan Josh", description: "Aromatic chicken rogan josh — Half ₹373 | Full ₹623", price: 373, category: "Indian Main Course", isVeg: false },
  { id: 183, name: "Extra Chicken Gravy", description: "Extra portion of chicken gravy", price: 123, category: "Indian Main Course", isVeg: false },
  { id: 184, name: "Mutton Curry (4P)", description: "Mutton curry — 4 pieces portion", price: 303, category: "Indian Main Course", isVeg: false },
  { id: 185, name: "Mutton Rada (4P)", description: "Mutton rada — 4 pieces portion", price: 323, category: "Indian Main Course", isVeg: false },
  { id: 186, name: "Mutton Khatta Meat (4P)", description: "Himachali sour mutton — 4 pieces portion", price: 353, category: "Indian Main Course", isVeg: false },
  { id: 187, name: "Mutton Handi (4P)", description: "Mutton handi — 4 pieces portion", price: 343, category: "Indian Main Course", isVeg: false },
  { id: 188, name: "Mutton Rogan Josh (4P)", description: "Mutton rogan josh — 4 pieces portion", price: 353, category: "Indian Main Course", isVeg: false },
  { id: 189, name: "Kadai Mutton (4P)", description: "Kadai mutton — 4 pieces portion", price: 343, category: "Indian Main Course", isVeg: false },
  { id: 190, name: "Mutton Do Pyaza (4P)", description: "Mutton do pyaza — 4 pieces portion", price: 333, category: "Indian Main Course", isVeg: false },
  { id: 191, name: "Mutton Curry", description: "Classic mutton curry — Half ₹363 | Full ₹673", price: 363, category: "Indian Main Course", isVeg: false },
  { id: 192, name: "Mutton Rada", description: "Himachali mutton rada — Half ₹403 | Full ₹693", price: 403, category: "Indian Main Course", isVeg: false },
  { id: 193, name: "Mutton Khatta Meat", description: "Himachali sour mutton — Half ₹453 | Full ₹763", price: 453, category: "Indian Main Course", isVeg: false },
  { id: 194, name: "Handi Mutton", description: "Slow-cooked handi mutton — Half ₹423 | Full ₹733", price: 423, category: "Indian Main Course", isVeg: false },
  { id: 195, name: "Mutton Rogan Josh", description: "Aromatic mutton rogan josh — Half ₹453 | Full ₹763", price: 453, category: "Indian Main Course", isVeg: false },
  { id: 196, name: "Kadai Mutton", description: "Mutton cooked in kadai masala — Half ₹423 | Full ₹733", price: 423, category: "Indian Main Course", isVeg: false },
  { id: 197, name: "Mutton Do Pyaza", description: "Mutton with double onion — Half ₹393 | Full ₹723", price: 393, category: "Indian Main Course", isVeg: false },
  { id: 198, name: "Extra Mutton Gravy", description: "Extra portion of mutton gravy", price: 143, category: "Indian Main Course", isVeg: false },

  // Chinese — Veg
  { id: 199, name: "Veg Chowmein", description: "Stir-fried noodles with vegetables — Half ₹63 | Full ₹93", price: 63, category: "Chinese", isVeg: true },
  { id: 200, name: "Cheese Special Chowmein", description: "Chowmein topped with cheese — Half ₹73 | Full ₹123", price: 73, category: "Chinese", isVeg: true },
  { id: 201, name: "Veg Hakka Noodles", description: "Indo-Chinese hakka noodles with vegetables — Half ₹83 | Full ₹133", price: 83, category: "Chinese", isVeg: true },
  { id: 202, name: "Veg Hot Garlic Noodles", description: "Noodles tossed in hot garlic sauce — Half ₹83 | Full ₹133", price: 83, category: "Chinese", isVeg: true },
  { id: 203, name: "Honey Chilli Potato", description: "Crispy potato in sweet and spicy honey chilli sauce", price: 253, category: "Chinese", isVeg: true },
  { id: 204, name: "Honey Chilli Cauliflower", description: "Crispy cauliflower in honey chilli sauce", price: 293, category: "Chinese", isVeg: true },
  { id: 205, name: "Mushroom Chilli Dry", description: "Dry-tossed mushrooms in spicy chilli sauce", price: 273, category: "Chinese", isVeg: true },
  { id: 206, name: "Mushroom Chilli Gravy", description: "Mushrooms in spicy chilli gravy", price: 293, category: "Chinese", isVeg: true },
  { id: 207, name: "Cheese Chilli Dry", description: "Paneer/cheese tossed dry in chilli sauce", price: 273, category: "Chinese", isVeg: true },
  { id: 208, name: "Cheese Chilli Gravy", description: "Paneer/cheese in chilli gravy", price: 293, category: "Chinese", isVeg: true },
  { id: 209, name: "Veg Thukpa", description: "Tibetan noodle soup with vegetables", price: 103, category: "Chinese", isVeg: true },
  { id: 210, name: "Veg Manchurian Dry", description: "Crispy veg balls tossed dry in Manchurian sauce", price: 253, category: "Chinese", isVeg: true },
  { id: 211, name: "Veg Manchurian Gravy", description: "Veg balls in rich Manchurian gravy", price: 273, category: "Chinese", isVeg: true },
  { id: 212, name: "Chilli Potato", description: "Crispy fried potato in spicy chilli sauce", price: 223, category: "Chinese", isVeg: true },
  { id: 213, name: "Veg Spring Roll", description: "Crispy rolls stuffed with seasoned vegetables", price: 183, category: "Chinese", isVeg: true },
  { id: 214, name: "Veg Chopsuey", description: "Crispy noodles topped with stir-fried vegetables in sauce", price: 243, category: "Chinese", isVeg: true },
  { id: 215, name: "Crispy Veg", description: "Mixed vegetables fried crispy and tossed in sauce", price: 253, category: "Chinese", isVeg: true },
  { id: 216, name: "Lemon Cheese", description: "Cheese in tangy lemon sauce", price: 253, category: "Chinese", isVeg: true },
  // Chinese — Non-Veg
  { id: 217, name: "Chilli Chicken Dry", description: "Crispy chicken tossed dry in chilli sauce — Half ₹303 | Full ₹533", price: 303, category: "Chinese", isVeg: false },
  { id: 218, name: "Chilli Chicken Gravy", description: "Chicken in spicy chilli gravy — Half ₹293 | Full ₹523", price: 293, category: "Chinese", isVeg: false },
  { id: 219, name: "Chilli Chicken Boneless", description: "Boneless chicken in chilli sauce — Half ₹333 | Full ₹573", price: 333, category: "Chinese", isVeg: false },
  { id: 220, name: "Lemon Chicken", description: "Chicken in tangy lemon sauce — Half ₹283 | Full ₹503", price: 283, category: "Chinese", isVeg: false },
  { id: 221, name: "Garlic Chicken", description: "Chicken tossed in bold garlic sauce", price: 353, category: "Chinese", isVeg: false },
  { id: 222, name: "Chicken Chowmein", description: "Stir-fried noodles with chicken — Half ₹93 | Full ₹153", price: 93, category: "Chinese", isVeg: false },
  { id: 223, name: "Mutton Chowmein", description: "Stir-fried noodles with mutton — Half ₹123 | Full ₹203", price: 123, category: "Chinese", isVeg: false },
  { id: 224, name: "Egg Chowmein", description: "Stir-fried noodles with egg — Half ₹83 | Full ₹153", price: 83, category: "Chinese", isVeg: false },
  { id: 225, name: "Chicken Thukpa", description: "Tibetan noodle soup with chicken", price: 173, category: "Chinese", isVeg: false },
  { id: 226, name: "Mutton Thukpa", description: "Tibetan noodle soup with mutton", price: 203, category: "Chinese", isVeg: false },
  { id: 227, name: "Chicken Chopsuey", description: "Crispy noodles topped with chicken in sauce", price: 273, category: "Chinese", isVeg: false },
  { id: 228, name: "Mutton Chopsuey", description: "Crispy noodles topped with mutton in sauce", price: 303, category: "Chinese", isVeg: false },
  { id: 229, name: "Chicken Manchurian Gravy", description: "Chicken balls in rich Manchurian gravy", price: 323, category: "Chinese", isVeg: false },
  { id: 230, name: "Chicken Garlic Chowmein", description: "Chowmein tossed in garlic sauce with chicken — Half ₹103 | Full ₹193", price: 103, category: "Chinese", isVeg: false },
  { id: 231, name: "Chicken 65", description: "Spicy deep-fried chicken, South Indian style", price: 393, category: "Chinese", isVeg: false },
  { id: 232, name: "Honey Crispy Chicken", description: "Crispy fried chicken tossed in honey glaze", price: 443, category: "Chinese", isVeg: false },
  { id: 233, name: "Chicken Black Peppers", description: "Chicken tossed in bold black pepper sauce", price: 423, category: "Chinese", isVeg: false },

  // Tandoori — Veg
  { id: 234, name: "Paneer Tikka", description: "Marinated cottage cheese grilled in tandoor", price: 273, category: "Tandoori", isVeg: true },
  { id: 235, name: "Paneer Achari Tikka", description: "Paneer marinated in pickling spices, tandoor grilled", price: 303, category: "Tandoori", isVeg: true },
  { id: 236, name: "Paneer Malai Tikka", description: "Paneer in creamy malai marinade, grilled in tandoor", price: 323, category: "Tandoori", isVeg: true },
  { id: 237, name: "Paneer Irani Tikka", description: "Paneer in Irani-style marinade, grilled to perfection", price: 303, category: "Tandoori", isVeg: true },
  { id: 238, name: "Lehsuni Tikka", description: "Garlic-marinated paneer tikka from tandoor", price: 323, category: "Tandoori", isVeg: true },
  { id: 239, name: "Mushroom Achari Tikka", description: "Mushrooms in pickling spice marinade, tandoor grilled", price: 303, category: "Tandoori", isVeg: true },
  { id: 240, name: "Tandoori Chaap", description: "Soya chaap marinated and grilled in tandoor", price: 253, category: "Tandoori", isVeg: true },
  { id: 241, name: "Malai Chaap", description: "Soya chaap in creamy malai marinade", price: 283, category: "Tandoori", isVeg: true },
  { id: 242, name: "Paneer Pudina Tikka", description: "Paneer with fresh mint marinade, tandoor grilled", price: 313, category: "Tandoori", isVeg: true },
  { id: 243, name: "Veg Seekh Kabab", description: "Spiced mixed vegetable kabab on skewer from tandoor", price: 223, category: "Tandoori", isVeg: true },
  { id: 244, name: "Veg Platter", description: "Paneer Malai Tikka + Veg Seekh Kebab + Mushroom Tikka + Stuffed Aloo + Paneer Tikka", price: 683, category: "Tandoori", isVeg: true },
  // Tandoori — Non-Veg
  { id: 245, name: "Tandoori Chicken", description: "Whole chicken marinated in yogurt and spices, tandoor grilled — Half ₹283 | Full ₹483", price: 283, category: "Tandoori", isVeg: false },
  { id: 246, name: "Afghani Chicken", description: "Chicken in creamy Afghani marinade from tandoor — Half ₹303 | Full ₹523", price: 303, category: "Tandoori", isVeg: false },
  { id: 247, name: "Chicken Tikka", description: "Boneless chicken marinated and grilled in tandoor", price: 353, category: "Tandoori", isVeg: false },
  { id: 248, name: "Chicken Malai Tikka", description: "Chicken in creamy malai marinade, tandoor grilled", price: 383, category: "Tandoori", isVeg: false },
  { id: 249, name: "Chicken Haryali Tikka", description: "Chicken in green herb marinade, tandoor grilled", price: 363, category: "Tandoori", isVeg: false },
  { id: 250, name: "Tandoori Chilli Tikka", description: "Spicy chilli-marinated chicken from tandoor", price: 383, category: "Tandoori", isVeg: false },
  { id: 251, name: "Chicken Seekh Kabab", description: "Minced chicken with herbs on skewer, tandoor grilled", price: 353, category: "Tandoori", isVeg: false },
  { id: 252, name: "Mutton Seekh Kabab", description: "Minced mutton with herbs on skewer, tandoor grilled", price: 403, category: "Tandoori", isVeg: false },
  { id: 253, name: "Non-Veg Platter", description: "Tandoori Chicken + Chicken Tikka + Chicken Seekh Kebab + Mutton Kebab + Chicken Malai Tikka", price: 903, category: "Tandoori", isVeg: false },

  // Rice — Veg
  { id: 254, name: "Plain Rice", description: "Steamed basmati rice", price: 83, category: "Rice", isVeg: true },
  { id: 255, name: "Zeera Rice", description: "Basmati rice tempered with cumin seeds", price: 113, category: "Rice", isVeg: true },
  { id: 256, name: "Matar Pulao", description: "Fragrant rice cooked with green peas", price: 163, category: "Rice", isVeg: true },
  { id: 257, name: "Veg Pulao", description: "Aromatic rice with mixed vegetables", price: 193, category: "Rice", isVeg: true },
  { id: 258, name: "Cheese Pulao", description: "Flavoured rice with cheese", price: 233, category: "Rice", isVeg: true },
  { id: 259, name: "Fried Rice", description: "Stir-fried rice with vegetables and soy sauce", price: 143, category: "Rice", isVeg: true },
  { id: 260, name: "Mushroom Fried Rice", description: "Fried rice with sautéed mushrooms", price: 163, category: "Rice", isVeg: true },
  { id: 261, name: "Veg Biryani", description: "Fragrant basmati rice with vegetables and spices", price: 243, category: "Rice", isVeg: true },
  { id: 262, name: "Veg Hyderabadi Biryani", description: "Dum-cooked Hyderabadi style veg biryani", price: 293, category: "Rice", isVeg: true },
  // Rice — Non-Veg
  { id: 263, name: "Chicken Biryani", description: "Aromatic dum biryani with tender chicken", price: 303, category: "Rice", isVeg: false },
  { id: 264, name: "Mutton Biryani", description: "Slow-cooked dum biryani with mutton", price: 353, category: "Rice", isVeg: false },
  { id: 265, name: "Chicken Hyderabadi Biryani", description: "Dum-cooked Hyderabadi style chicken biryani", price: 353, category: "Rice", isVeg: false },
  { id: 266, name: "Egg Fried Rice", description: "Stir-fried rice with egg", price: 163, category: "Rice", isVeg: false },
  { id: 267, name: "Chicken Fried Rice", description: "Stir-fried rice with chicken", price: 203, category: "Rice", isVeg: false },
  { id: 268, name: "Egg Hyderabadi Biryani", description: "Hyderabadi style biryani with egg", price: 263, category: "Rice", isVeg: false },
  { id: 269, name: "Mutton Hyderabadi Biryani", description: "Dum-cooked Hyderabadi style mutton biryani", price: 373, category: "Rice", isVeg: false },
  { id: 270, name: "Mutton Fried Rice", description: "Stir-fried rice with mutton", price: 263, category: "Rice", isVeg: false },

  // Thalis — Veg
  { id: 271, name: "Veg Thali (Student)", description: "Budget student thali with dal, sabzi, rice and roti", price: 113, category: "Thalis", isVeg: true },
  { id: 272, name: "Veg Thali (Special)", description: "Special thali with dal, sabzi, raita, rice and roti", price: 153, category: "Thalis", isVeg: true },
  { id: 273, name: "Veg Thali (Super Deluxe)", description: "Kadai Paneer, Dal Makhani, Mix Veg, Raita, Butter Naan, Rice, 1pc Gulab Jamun", price: 303, category: "Thalis", isVeg: true },
  // Thalis — Non-Veg
  { id: 274, name: "Non-Veg Thali (Chicken Student)", description: "Student chicken thali with curry, rice and roti", price: 153, category: "Thalis", isVeg: false },
  { id: 275, name: "Non-Veg Thali (Mutton Student)", description: "Student mutton thali with curry, rice and roti", price: 193, category: "Thalis", isVeg: false },
  { id: 276, name: "Non-Veg Thali (Super Deluxe)", description: "Butter Chicken, Rajmah, Mix Veg, Salad, Raita, Papad, Butter Naan, Jeera Rice, 1pc Gulab Jamun", price: 403, category: "Thalis", isVeg: false },

  // Roti — Veg
  { id: 277, name: "Tandoori Roti", description: "Whole wheat bread baked in tandoor", price: 10, category: "Roti", isVeg: true },
  { id: 278, name: "Tawa Chapati", description: "Soft whole wheat chapati from tawa", price: 15, category: "Roti", isVeg: true },
  { id: 279, name: "Tandoori Butter Roti", description: "Tandoori roti brushed with butter", price: 20, category: "Roti", isVeg: true },
  { id: 280, name: "Tawa Butter Roti", description: "Tawa roti served with butter", price: 25, category: "Roti", isVeg: true },
  { id: 281, name: "Mint Parantha", description: "Flaky layered parantha with fresh mint", price: 50, category: "Roti", isVeg: true },
  { id: 282, name: "Aloo Kulcha", description: "Soft kulcha stuffed with spiced potato", price: 60, category: "Roti", isVeg: true },
  { id: 283, name: "Missi Roti with Butter", description: "Gram flour flatbread served with butter", price: 40, category: "Roti", isVeg: true },
  { id: 284, name: "Onion Kulcha", description: "Soft kulcha stuffed with seasoned onion", price: 60, category: "Roti", isVeg: true },
  { id: 285, name: "Paneer Kulcha", description: "Soft kulcha stuffed with spiced paneer", price: 80, category: "Roti", isVeg: true },
  { id: 286, name: "Gobhi Kulcha", description: "Soft kulcha stuffed with spiced cauliflower", price: 70, category: "Roti", isVeg: true },
  { id: 287, name: "Aloo Pyaz Kulcha", description: "Kulcha stuffed with potato and onion", price: 60, category: "Roti", isVeg: true },
  { id: 288, name: "Butter Naan", description: "Soft leavened bread baked in tandoor, brushed with butter", price: 50, category: "Roti", isVeg: true },
  { id: 289, name: "Plain Naan", description: "Soft plain naan baked in tandoor", price: 35, category: "Roti", isVeg: true },
  { id: 290, name: "Garlic Naan / Cheese Naan", description: "Naan with garlic or cheese topping", price: 70, category: "Roti", isVeg: true },
  { id: 291, name: "Lachha Prantha", description: "Flaky multi-layered whole wheat parantha", price: 50, category: "Roti", isVeg: true },
  { id: 292, name: "Mix Basket", description: "Butter Naan, Lacha Paratha, Garlic Naan, Missi Roti", price: 220, category: "Roti", isVeg: true },

  // Desserts — Veg
  { id: 293, name: "Rasmalai", description: "Soft cottage cheese patties in sweetened milk — 1pc ₹73 | 2pc ₹143", price: 73, category: "Desserts", isVeg: true },
  { id: 294, name: "Gulab Jamun", description: "Khoya dumplings soaked in rose-cardamom syrup — 1pc ₹33 | 2pc ₹63", price: 33, category: "Desserts", isVeg: true },
  { id: 295, name: "Gajrella (Seasonal)", description: "Traditional carrot halwa, available in season", price: 133, category: "Desserts", isVeg: true },
  { id: 296, name: "Rice Pudding", description: "Creamy sweetened rice cooked in milk", price: 63, category: "Desserts", isVeg: true },
  { id: 297, name: "Ice Cream — Strawberry", description: "Creamy strawberry ice cream", price: 63, category: "Desserts", isVeg: true },
  { id: 298, name: "Ice Cream — Butter Scotch", description: "Creamy butterscotch ice cream", price: 83, category: "Desserts", isVeg: true },
  { id: 299, name: "Ice Cream — Choco", description: "Rich chocolate ice cream", price: 93, category: "Desserts", isVeg: true },
  { id: 300, name: "Ice Cream — Mango", description: "Fresh mango ice cream", price: 103, category: "Desserts", isVeg: true },

  // Beer & Breezer
  { id: 301, name: "Tuborg Beer", description: "330ml can/bottle", price: 380, category: "Beer & Breezer", isVeg: true },
  { id: 302, name: "Tuborg Green Beer", description: "330ml can/bottle", price: 360, category: "Beer & Breezer", isVeg: true },
  { id: 303, name: "Kingfisher Strong Beer", description: "330ml can/bottle", price: 380, category: "Beer & Breezer", isVeg: true },
  { id: 304, name: "Kingfisher Ultra Beer", description: "330ml can/bottle", price: 450, category: "Beer & Breezer", isVeg: true },
  { id: 305, name: "Kingfisher Lager Beer", description: "330ml can/bottle", price: 360, category: "Beer & Breezer", isVeg: true },
  { id: 306, name: "Budweiser Beer", description: "330ml can/bottle", price: 400, category: "Beer & Breezer", isVeg: true },
  { id: 307, name: "Budweiser Magnum Beer", description: "330ml can/bottle", price: 450, category: "Beer & Breezer", isVeg: true },
  { id: 308, name: "Thunderbolt Beer", description: "330ml can/bottle", price: 380, category: "Beer & Breezer", isVeg: true },
  { id: 309, name: "Heineken Beer", description: "330ml can/bottle", price: 450, category: "Beer & Breezer", isVeg: true },
  { id: 310, name: "Bro Code Beer", description: "330ml can/bottle", price: 450, category: "Beer & Breezer", isVeg: true },
  { id: 311, name: "Bacardi Breezer", description: "275ml flavoured breezer", price: 180, category: "Beer & Breezer", isVeg: true },
  { id: 312, name: "Bacardi RTD (8%)", description: "Ready-to-drink 8% Bacardi", price: 200, category: "Beer & Breezer", isVeg: true },

  // Rum — price shown per 60ml peg | 30ml ₹X | 60ml ₹Y | 360ml ₹Z | 750ml ₹W
  { id: 313, name: "Bacardi Black Rum", description: "30ml ₹100 | 60ml ₹160 | 360ml ₹850 | 750ml ₹1600", price: 160, category: "Rum", isVeg: true },
  { id: 314, name: "Bacardi White Rum", description: "30ml ₹110 | 60ml ₹180 | 360ml ₹950 | 750ml ₹1800", price: 180, category: "Rum", isVeg: true },
  { id: 315, name: "Old Monk Rum", description: "30ml ₹65 | 60ml ₹110 | 360ml ₹600 | 750ml ₹1100", price: 110, category: "Rum", isVeg: true },
  { id: 316, name: "Camikara Rum", description: "30ml ₹150 | 60ml ₹250 | 360ml ₹1450 | 750ml ₹2800", price: 250, category: "Rum", isVeg: true },

  // Vodka — price shown per 60ml peg
  { id: 317, name: "Absolut Vodka (Plain)", description: "30ml ₹150 | 60ml ₹250 | 360ml ₹1450 | 750ml ₹2800", price: 250, category: "Vodka", isVeg: true },
  { id: 318, name: "Absolut Vodka (Flavoured)", description: "30ml ₹180 | 60ml ₹280 | 360ml ₹1550 | 750ml ₹3000", price: 280, category: "Vodka", isVeg: true },
  { id: 319, name: "Magic Moments Vodka (Plain)", description: "30ml ₹80 | 60ml ₹130 | 360ml ₹700 | 750ml ₹1300", price: 130, category: "Vodka", isVeg: true },
  { id: 320, name: "Magic Moments Vodka (Flavoured)", description: "30ml ₹90 | 60ml ₹150 | 360ml ₹800 | 750ml ₹1500", price: 150, category: "Vodka", isVeg: true },
  { id: 321, name: "Smirnoff Vodka (Plain)", description: "30ml ₹100 | 60ml ₹160 | 360ml ₹850 | 750ml ₹1600", price: 160, category: "Vodka", isVeg: true },
  { id: 322, name: "Smirnoff Vodka (Flavoured)", description: "30ml ₹120 | 60ml ₹190 | 360ml ₹1050 | 750ml ₹2000", price: 190, category: "Vodka", isVeg: true },
  { id: 323, name: "Cashmir Vodka", description: "30ml ₹180 | 60ml ₹280 | 360ml ₹1550 | 750ml ₹3000", price: 280, category: "Vodka", isVeg: true },

  // Whisky & Scotch — price shown per 60ml peg
  { id: 324, name: "Chivas Regal 12 Year Old", description: "30ml ₹200 | 60ml ₹350 | 360ml ₹2050 | 750ml ₹4000", price: 350, category: "Whisky & Scotch", isVeg: true },
  { id: 325, name: "Chivas Regal 18 Year Old", description: "30ml ₹350 | 60ml ₹650 | 360ml ₹3800 | 750ml ₹7500", price: 650, category: "Whisky & Scotch", isVeg: true },
  { id: 326, name: "Johnnie Walker Black Label", description: "30ml ₹200 | 60ml ₹350 | 360ml ₹2050 | 750ml ₹4000", price: 350, category: "Whisky & Scotch", isVeg: true },
  { id: 327, name: "Johnnie Walker Red Label", description: "30ml ₹150 | 60ml ₹250 | 360ml ₹1450 | 750ml ₹2800", price: 250, category: "Whisky & Scotch", isVeg: true },
  { id: 328, name: "Ballantine's Finest", description: "30ml ₹150 | 60ml ₹250 | 360ml ₹1450 | 750ml ₹2800", price: 250, category: "Whisky & Scotch", isVeg: true },
  { id: 329, name: "Jim Beam Bourbon", description: "30ml ₹180 | 60ml ₹280 | 360ml ₹1550 | 750ml ₹3000", price: 280, category: "Whisky & Scotch", isVeg: true },
  { id: 330, name: "Jack Daniel's Old No. 7", description: "30ml ₹230 | 60ml ₹400 | 360ml ₹2300 | 750ml ₹4500", price: 400, category: "Whisky & Scotch", isVeg: true },
  { id: 331, name: "100 Pipers Blended Scotch Whisky", description: "30ml ₹150 | 60ml ₹250 | 360ml ₹1450 | 750ml ₹2800", price: 250, category: "Whisky & Scotch", isVeg: true },
  { id: 332, name: "100 Pipers 12 Year Old", description: "30ml ₹190 | 60ml ₹330 | 360ml ₹1800 | 750ml ₹3500", price: 330, category: "Whisky & Scotch", isVeg: true },
  { id: 333, name: "Black Dog Scotch Whisky", description: "30ml ₹180 | 60ml ₹280 | 360ml ₹1550 | 750ml ₹3000", price: 280, category: "Whisky & Scotch", isVeg: true },
  { id: 334, name: "Vat 69 Blended Scotch Whisky", description: "30ml ₹140 | 60ml ₹240 | 360ml ₹1350 | 750ml ₹2600", price: 240, category: "Whisky & Scotch", isVeg: true },
  { id: 335, name: "Antiquity Blue Whisky", description: "30ml ₹130 | 60ml ₹200 | 360ml ₹1150 | 750ml ₹2200", price: 200, category: "Whisky & Scotch", isVeg: true },
  { id: 336, name: "Teacher's Highland Cream", description: "30ml ₹180 | 60ml ₹280 | 360ml ₹1550 | 750ml ₹3000", price: 280, category: "Whisky & Scotch", isVeg: true },
  { id: 337, name: "Teacher's 50 / Origin", description: "30ml ₹190 | 60ml ₹330 | 360ml ₹1800 | 750ml ₹3500", price: 330, category: "Whisky & Scotch", isVeg: true },
  { id: 338, name: "Indri-Trini The Three Wood Whisky", description: "30ml ₹250 | 60ml ₹450 | 360ml ₹2550 | 750ml ₹5000", price: 450, category: "Whisky & Scotch", isVeg: true },
  { id: 339, name: "Jameson Irish Whiskey", description: "30ml ₹190 | 60ml ₹330 | 360ml ₹1800 | 750ml ₹3500", price: 330, category: "Whisky & Scotch", isVeg: true },
  { id: 340, name: "Black & White Blended Scotch Whisky", description: "30ml ₹180 | 60ml ₹280 | 360ml ₹1550 | 750ml ₹3000", price: 280, category: "Whisky & Scotch", isVeg: true },
  { id: 341, name: "Signature Rare Aged Whisky", description: "30ml ₹100 | 60ml ₹160 | 360ml ₹850 | 750ml ₹1600", price: 160, category: "Whisky & Scotch", isVeg: true },
  { id: 342, name: "Blenders Pride Whisky", description: "30ml ₹100 | 60ml ₹160 | 360ml ₹850 | 750ml ₹1600", price: 160, category: "Whisky & Scotch", isVeg: true },
  { id: 343, name: "Royal Stag Whisky", description: "30ml ₹70 | 60ml ₹120 | 360ml ₹650 | 750ml ₹1200", price: 120, category: "Whisky & Scotch", isVeg: true },
  { id: 344, name: "Sterling Reserve Whisky", description: "30ml ₹70 | 60ml ₹120 | 360ml ₹650 | 750ml ₹1200", price: 120, category: "Whisky & Scotch", isVeg: true },
  { id: 345, name: "Royal Challenge Whisky", description: "30ml ₹70 | 60ml ₹120 | 360ml ₹650 | 750ml ₹1200", price: 120, category: "Whisky & Scotch", isVeg: true },
  { id: 346, name: "Rockford Reserve Whisky", description: "30ml ₹100 | 60ml ₹160 | 360ml ₹850 | 750ml ₹1600", price: 160, category: "Whisky & Scotch", isVeg: true },
  { id: 347, name: "Indri Agneya Whisky", description: "30ml ₹350 | 60ml ₹650 | 360ml ₹3800 | 750ml ₹7500", price: 650, category: "Whisky & Scotch", isVeg: true },
  { id: 348, name: "Whistler Whisky", description: "30ml ₹100 | 60ml ₹160 | 360ml ₹850 | 750ml ₹1600", price: 160, category: "Whisky & Scotch", isVeg: true },

  // Cocktails
  { id: 349, name: "Green Screwdriver", description: "Blue Curacao Syrup, Vodka, Orange Juice", price: 403, category: "Cocktails", isVeg: true },
  { id: 350, name: "Rainbow Paradise", description: "Pineapple Juice, Grenadine Syrup, Coconut Rum, Blue Curacao", price: 353, category: "Cocktails", isVeg: true },
  { id: 351, name: "Rainbow", description: "Mango Juice, Grenadine Syrup, Vodka, Blue Curacao", price: 403, category: "Cocktails", isVeg: true },
  { id: 352, name: "Long Beach Iced Tea", description: "Vodka, White Rum, Tequila, Gin, Triple Sec, Simple Syrup, Lemon Juice", price: 1003, category: "Cocktails", isVeg: true },
  { id: 353, name: "Tequila Sunrise", description: "Tequila, Orange Juice, Grenadine Syrup", price: 403, category: "Cocktails", isVeg: true },
  { id: 354, name: "Pina Colada", description: "Pineapple, White Rum, Coconut Cream, Coconut Milk", price: 503, category: "Cocktails", isVeg: true },
  { id: 355, name: "Vodka Cranberry", description: "Vodka, Cranberry Juice, Orange Juice", price: 423, category: "Cocktails", isVeg: true },
  { id: 356, name: "Blue Lagoon Cocktail", description: "Lemon, Mint, Vodka, Blue Curacao, Syrup, Lime Juice", price: 353, category: "Cocktails", isVeg: true },
  { id: 357, name: "Dragon Margreta", description: "Redwine, Lemon Juice, Simple Syrup, Bourbon, Whisky, Egg", price: 503, category: "Cocktails", isVeg: false },

  // Mocktails
  { id: 358, name: "Virgin Mojito", description: "Fresh mint, lime, soda", price: 153, category: "Mocktails", isVeg: true },
  { id: 359, name: "Italian Smooch", description: "Fruity Italian-style mocktail", price: 203, category: "Mocktails", isVeg: true },
  { id: 360, name: "Blue Lagoon Mocktail", description: "Blue Curacao syrup with lime and soda", price: 173, category: "Mocktails", isVeg: true },
  { id: 361, name: "Strawberry Crush", description: "Fresh strawberry crush with mint and soda", price: 153, category: "Mocktails", isVeg: true },
  { id: 362, name: "Orange Sunrise", description: "Orange juice layered with grenadine", price: 203, category: "Mocktails", isVeg: true },
  { id: 363, name: "Rainbow Heaven", description: "Layered fruity mocktail", price: 223, category: "Mocktails", isVeg: true },
  { id: 364, name: "Lemon Iced Tea", description: "Chilled lemon-infused iced tea", price: 103, category: "Mocktails", isVeg: true },
  { id: 365, name: "Fresh Lime Soda", description: "Fresh lime with sweet or salted soda", price: 83, category: "Mocktails", isVeg: true },

  // Cold Drinks
  { id: 366, name: "Coke", description: "Coca-Cola chilled", price: 43, category: "Cold Drinks", isVeg: true },
  { id: 367, name: "Fanta", description: "Chilled Fanta orange", price: 43, category: "Cold Drinks", isVeg: true },
  { id: 368, name: "Sprite", description: "Chilled Sprite", price: 43, category: "Cold Drinks", isVeg: true },
  { id: 369, name: "Dew", description: "Chilled Mountain Dew", price: 43, category: "Cold Drinks", isVeg: true },
  { id: 370, name: "Thums Up", description: "Chilled Thums Up", price: 43, category: "Cold Drinks", isVeg: true },
  { id: 371, name: "Lassi Sweet / Salted", description: "Chilled lassi — sweet or salted", price: 73, category: "Cold Drinks", isVeg: true },
  { id: 372, name: "Lassi Mix", description: "Mixed flavour lassi", price: 83, category: "Cold Drinks", isVeg: true },
  { id: 373, name: "Pineapple Lassi", description: "Creamy lassi with pineapple", price: 103, category: "Cold Drinks", isVeg: true },
  { id: 374, name: "Mix Fruit Lassi", description: "Lassi blended with mixed fruits", price: 123, category: "Cold Drinks", isVeg: true },
  { id: 375, name: "Butter Milk", description: "Chilled spiced buttermilk (chaas)", price: 63, category: "Cold Drinks", isVeg: true },
  { id: 376, name: "Mix Fruit Juice", description: "Freshly blended mixed fruit juice", price: 103, category: "Cold Drinks", isVeg: true },
  { id: 377, name: "Guava Juice", description: "Fresh guava juice", price: 93, category: "Cold Drinks", isVeg: true },
  { id: 378, name: "Pineapple Juice", description: "Fresh pineapple juice", price: 113, category: "Cold Drinks", isVeg: true },
  { id: 379, name: "Cranberry Juice", description: "Chilled cranberry juice", price: 153, category: "Cold Drinks", isVeg: true },
  { id: 380, name: "Lemon Soda", description: "Fresh lemon with soda", price: 83, category: "Cold Drinks", isVeg: true },
  { id: 381, name: "Lemon Water", description: "Fresh lemon water", price: 43, category: "Cold Drinks", isVeg: true },

  // Tea & Coffee
  { id: 382, name: "Masala Tea", description: "Spiced Indian chai", price: 33, category: "Tea & Coffee", isVeg: true },
  { id: 383, name: "Tea", description: "Classic Indian tea", price: 23, category: "Tea & Coffee", isVeg: true },
  { id: 384, name: "Ginger Tea", description: "Strong ginger-infused tea", price: 33, category: "Tea & Coffee", isVeg: true },
  { id: 385, name: "Ginger Lemon Honey Tea", description: "Soothing ginger, lemon and honey tea", price: 63, category: "Tea & Coffee", isVeg: true },
  { id: 386, name: "Lemon Tea", description: "Light tea with fresh lemon", price: 33, category: "Tea & Coffee", isVeg: true },
  { id: 387, name: "Green Tea", description: "Refreshing green tea", price: 53, category: "Tea & Coffee", isVeg: true },
  { id: 388, name: "Hot Coffee", description: "Classic hot brewed coffee", price: 63, category: "Tea & Coffee", isVeg: true },
  { id: 389, name: "Cold Coffee", description: "Chilled blended coffee with milk", price: 93, category: "Tea & Coffee", isVeg: true },
  { id: 390, name: "Milk", description: "Full-cream hot or cold milk", price: 63, category: "Tea & Coffee", isVeg: true },
  { id: 391, name: "Black Tea", description: "Plain black tea", price: 13, category: "Tea & Coffee", isVeg: true },
  { id: 392, name: "Ice Tea", description: "Chilled flavoured ice tea", price: 93, category: "Tea & Coffee", isVeg: true },
  { id: 393, name: "Lemon Ice Tea", description: "Chilled lemon-flavoured ice tea", price: 103, category: "Tea & Coffee", isVeg: true },

  // Shakes
  { id: 394, name: "Chocolate Shake", description: "Rich chocolate milkshake", price: 123, category: "Shakes", isVeg: true },
  { id: 395, name: "Vanilla Shake", description: "Creamy vanilla milkshake", price: 103, category: "Shakes", isVeg: true },
  { id: 396, name: "Banana Shake", description: "Fresh banana milkshake", price: 123, category: "Shakes", isVeg: true },
  { id: 397, name: "Strawberry Shake", description: "Fresh strawberry milkshake", price: 103, category: "Shakes", isVeg: true },
  { id: 398, name: "Oreo Shake", description: "Blended Oreo cookie milkshake", price: 153, category: "Shakes", isVeg: true },
  { id: 399, name: "Mango Shake", description: "Fresh mango milkshake", price: 123, category: "Shakes", isVeg: true },
  { id: 400, name: "Butter Scotch Shake", description: "Butterscotch flavoured milkshake", price: 123, category: "Shakes", isVeg: true },
  { id: 401, name: "Milk Shake", description: "Classic creamy milkshake", price: 123, category: "Shakes", isVeg: true },
  { id: 402, name: "Pineapple Shake", description: "Fresh pineapple milkshake", price: 123, category: "Shakes", isVeg: true },
  { id: 403, name: "Black Currant Shake", description: "Black currant flavoured milkshake", price: 163, category: "Shakes", isVeg: true },
];

const WHATSAPP_NUMBER = "918351024455";

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 11; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break;
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const period = h >= 12 ? "PM" : "AM";
      slots.push(`${displayHour}:${m === 0 ? "00" : "30"} ${period}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function getAvailableTimeSlots(): string[] {
  if (typeof window === "undefined") return TIME_SLOTS;
  const now = new Date();
  const currentH = now.getHours();
  const currentM = now.getMinutes();
  const available = TIME_SLOTS.filter((slot) => {
    const [timePart, period] = slot.split(" ");
    const [hStr, mStr] = timePart.split(":");
    let h = parseInt(hStr);
    const m = parseInt(mStr);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h > currentH || (h === currentH && m >= currentM);
  });
  return available.length > 0 ? available : TIME_SLOTS;
}

const VegIcon = ({ isVeg }: { isVeg: boolean }) => (
  <span
    className={`inline-flex items-center justify-center w-4 h-4 border-2 flex-shrink-0 ${isVeg ? "border-green-600" : "border-red-600"}`}
    title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
  >
    <span className={`w-2 h-2 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
  </span>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [modal, setModal] = useState<MenuItem | null>(null);
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.getAttribute("data-category") ?? "");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    CATEGORIES.forEach((cat) => {
      const el = categoryRefs.current[cat];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
    isScrollingRef.current = true;
    const tabsEl = tabsRef.current;
    if (tabsEl) {
      const btn = tabsEl.querySelector(`[data-tab="${cat}"]`) as HTMLElement;
      if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    categoryRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, []);

  const openAddModal = (item: MenuItem) => {
    setModal(item);
    setOrderType("dine-in");
    const available = getAvailableTimeSlots();
    setSelectedTime(available[0]);
  };

  const confirmAdd = () => {
    if (!modal) return;
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.id === modal.id && c.orderType === orderType && c.time === selectedTime
      );
      if (existing) {
        return prev.map((c) =>
          c.id === modal.id && c.orderType === orderType && c.time === selectedTime
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { ...modal, quantity: 1, orderType, time: selectedTime }];
    });
    setModal(null);
  };

  const removeItem = (id: number) => setCart((p) => p.filter((c) => c.id !== id));

  const updateQty = (id: number, delta: number) =>
    setCart((p) =>
      p.map((c) => (c.id === id ? { ...c, quantity: c.quantity + delta } : c)).filter((c) => c.quantity > 0)
    );

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const sendWhatsApp = () => {
    if (!cart.length) return;
    const first = cart[0];
    const typeLabel = first.orderType === "dine-in" ? "Dine-In" : "Pickup";
    const lines = cart
      .map((c) => `• ${c.name} x${c.quantity} — ₹${(c.price * c.quantity).toLocaleString("en-IN")}`)
      .join("\n");
    const msg = [
      `Hi! I would like to place an order from *Shiva Drink & Dine* 🍽️`,
      ``,
      `*Order Type:* ${typeLabel}`,
      `*Time:* ${first.time}`,
      ``,
      `*Items:*`,
      lines,
      ``,
      `*Total: ₹${total.toLocaleString("en-IN")} + GST*`,
      ``,
      `Please confirm my order. Thank you! 🙏`,
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const searchQuery = search.trim().toLowerCase();
  const searchResults = searchQuery
    ? MENU_ITEMS.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery) ||
          i.category.toLowerCase().includes(searchQuery)
      )
    : [];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm select-none">
              S
            </div>
            <div>
              <h1 className="text-base font-black text-stone-900 leading-tight tracking-tight">Shiva Drink & Dine</h1>
              <p className="text-[11px] font-medium text-orange-400 leading-none tracking-wide uppercase">Fresh food • Great vibes</p>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="cursor-pointer relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white pl-4 pr-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md"
          >
            <CartIcon />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-black ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Discount Notice ─────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-semibold text-amber-800">
        Up to 20% discount for Students &amp; Army persons on ID card &nbsp;|&nbsp; 5% GST extra on all items
      </div>

      {/* ── Search + Category Filter ─────────────────────────────── */}
      <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/70 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Search bar */}
          <div className="px-4 sm:px-6 pt-2.5 pb-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items or categories…"
                className="w-full bg-stone-100 rounded-xl pl-9 pr-9 py-2.5 text-sm text-stone-800 placeholder-stone-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-300 hover:bg-stone-400 flex items-center justify-center transition-colors"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Category pills — hidden while searching */}
          {!search && (
            <div className="relative">
              <div
                ref={tabsRef}
                className="flex gap-1.5 overflow-x-auto px-4 sm:px-6 pb-2.5"
                style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    data-tab={cat}
                    onClick={() => scrollToCategory(cat)}
                    className={`cursor-pointer flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 select-none ${
                      activeCategory === cat
                        ? "bg-orange-500 text-white shadow-md shadow-orange-300/40 scale-[1.04]"
                        : "bg-stone-100 text-stone-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <div className="flex-shrink-0 w-8" />
              </div>
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
            </div>
          )}
        </div>
      </nav>

      {/* ── Menu Sections ───────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-36">

        {/* ── Search Results ── */}
        {searchQuery && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-orange-500 rounded-full flex-shrink-0" />
              <h2 className="text-base font-black text-stone-900 tracking-tight">
                Results for &ldquo;{search.trim()}&rdquo;
              </h2>
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-[11px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                {searchResults.length} found
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <p className="font-bold text-stone-700">No items found</p>
                <p className="text-sm text-stone-400">Try a different item or category name</p>
                <button
                  onClick={() => setSearch("")}
                  className="cursor-pointer mt-1 px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {searchResults.map((item) => {
                  const cartEntry = cart.find((c) => c.id === item.id);
                  const qty = cart.filter((c) => c.id === item.id).reduce((s, c) => s + c.quantity, 0);
                  return (
                    <div key={item.id} className="bg-white rounded-xl px-4 py-3 border border-stone-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <VegIcon isVeg={item.isVeg} />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wide">{item.category}</p>
                          <h3 className="font-semibold text-stone-800 text-[14px] leading-snug">{item.name}</h3>
                          <p className="text-[13px] font-bold text-stone-900 mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      {qty > 0 ? (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => setCart((prev) => { const idx = prev.findIndex((c) => c.id === item.id); if (idx === -1) return prev; const u = [...prev]; u[idx] = { ...u[idx], quantity: u[idx].quantity - 1 }; return u.filter((c) => c.quantity > 0); })} className="cursor-pointer w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-lg flex items-center justify-center transition-all">−</button>
                          <span className="w-6 text-center font-black text-stone-900 text-[14px]">{qty}</span>
                          <button onClick={() => setCart((prev) => { const idx = prev.findIndex((c) => c.id === item.id); if (idx === -1) return prev; const u = [...prev]; u[idx] = { ...u[idx], quantity: u[idx].quantity + 1 }; return u; })} className="cursor-pointer w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-lg flex items-center justify-center transition-all">+</button>
                        </div>
                      ) : (
                        <button onClick={() => openAddModal(item)} className="cursor-pointer flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-lg text-[13px] font-bold transition-all active:scale-95 select-none bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200/60">
                          <span className="text-base leading-none">+</span>Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Category Sections (hidden while searching) ── */}
        {!searchQuery && CATEGORIES.map((cat) => (
          <section
            key={cat}
            data-category={cat}
            ref={(el) => { categoryRefs.current[cat] = el; }}
            className="mb-12 scroll-mt-36"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-orange-500 rounded-full flex-shrink-0" />
              <h2 className="text-base font-black text-stone-900 whitespace-nowrap tracking-tight">{cat}</h2>
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-[11px] font-bold text-orange-500 whitespace-nowrap bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                {MENU_ITEMS.filter((i) => i.category === cat).length} items
              </span>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {MENU_ITEMS.filter((i) => i.category === cat).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl px-4 py-3 border border-stone-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <VegIcon isVeg={item.isVeg} />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-stone-800 text-[14px] leading-snug">{item.name}</h3>
                      <p className="text-[13px] font-bold text-stone-900 mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  {(() => {
                    const cartEntry = cart.find((c) => c.id === item.id);
                    const qty = cart.filter((c) => c.id === item.id).reduce((s, c) => s + c.quantity, 0);

                    if (qty > 0) {
                      return (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() =>
                              setCart((prev) => {
                                const idx = prev.findIndex((c) => c.id === item.id);
                                if (idx === -1) return prev;
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 };
                                return updated.filter((c) => c.quantity > 0);
                              })
                            }
                            className="cursor-pointer w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-lg flex items-center justify-center transition-all"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-black text-stone-900 text-[14px]">{qty}</span>
                          <button
                            onClick={() =>
                              setCart((prev) => {
                                const idx = prev.findIndex((c) => c.id === item.id);
                                if (idx === -1) return prev;
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
                                return updated;
                              })
                            }
                            className="cursor-pointer w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-lg flex items-center justify-center transition-all"
                          >
                            +
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={() => openAddModal(item)}
                        className="cursor-pointer flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-lg text-[13px] font-bold transition-all active:scale-95 select-none bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200/60"
                      >
                        <span className="text-base leading-none">+</span>
                        Add
                      </button>
                    );
                  })()}
                </div>
              ))}
            </div>
          </section>
        ))}

      </main>

      {/* ── Add Item Modal ──────────────────────────────────────── */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient header */}
            <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 px-6 pt-4 pb-7">
              {/* Decorative blobs */}
              <div className="absolute right-5 top-3 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute right-16 bottom-0 w-10 h-10 bg-white/10 rounded-full" />
              {/* Drag handle */}
              <div className="w-10 h-1 bg-white/40 rounded-full mx-auto mb-4 sm:hidden" />
              {/* Close button */}
              <button
                onClick={() => setModal(null)}
                className="cursor-pointer absolute right-4 top-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors sm:flex hidden"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Veg indicator */}
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 ${
                  modal.isVeg ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${modal.isVeg ? "bg-green-300" : "bg-red-300"}`} />
                {modal.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              </span>
              <h3 className="text-2xl font-black text-white leading-tight pr-10">{modal.name}</h3>
              <p className="text-3xl font-black text-white/90 mt-1">₹{modal.price.toLocaleString("en-IN")}</p>
              {modal.description && (
                <p className="text-white/70 text-xs mt-2 font-medium leading-relaxed">{modal.description}</p>
              )}
            </div>

            {/* Body */}
            <div className="px-6 pt-5 pb-6">
              {/* Order type */}
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2.5">Order Type</p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {(["dine-in", "pickup"] as OrderType[]).map((type) => {
                  const labels: Record<OrderType, string> = { "dine-in": "Dine-In", pickup: "Pickup" };
                  const icons: Record<OrderType, string> = { "dine-in": "🍽️", pickup: "🛍️" };
                  const isActive = orderType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`cursor-pointer relative flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all select-none border-2 ${
                        isActive
                          ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                          : "border-stone-100 bg-stone-50 text-stone-500 hover:border-orange-200 hover:text-orange-500"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                      <span className="text-lg">{icons[type]}</span>
                      <span>{labels[type]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time slot */}
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2.5">Select Time</p>
              <div className="relative mb-5">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="cursor-pointer w-full appearance-none bg-stone-50 border-2 border-stone-100 focus:border-orange-400 rounded-xl pl-10 pr-10 py-3 text-stone-800 font-semibold text-sm focus:outline-none transition-colors"
                >
                  {getAvailableTimeSlots().map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="cursor-pointer flex-1 py-3.5 rounded-xl border-2 border-stone-200 text-stone-500 font-bold text-sm hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAdd}
                  className="cursor-pointer flex-[2] py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm transition-all shadow-lg shadow-orange-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cart Drawer ─────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

          <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl h-full overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div>
                <h2 className="text-lg font-black text-stone-900 tracking-tight">Your Cart</h2>
                {cart.length > 0 && (
                  <p className="text-xs font-semibold text-orange-400">{cartCount} item{cartCount !== 1 ? "s" : ""} added</p>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-orange-50 text-stone-400 hover:text-orange-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Empty State */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-300">
                  <CartIcon />
                </div>
                <div>
                  <p className="font-black text-stone-800 text-base">Cart is empty</p>
                  <p className="text-sm text-stone-400 mt-1">Add items from the menu to get started</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="cursor-pointer mt-1 px-6 py-3 bg-orange-500 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors shadow-md"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <VegIcon isVeg={item.isVeg} />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 text-sm leading-snug">{item.name}</p>
                            <p className="text-xs font-semibold text-orange-400 mt-0.5">
                              {item.orderType === "dine-in" ? "Dine-In 🍽️" : "Pickup 🛍️"} • {item.time}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="cursor-pointer text-stone-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="cursor-pointer w-8 h-8 rounded-xl bg-white border border-stone-200 hover:border-orange-300 flex items-center justify-center text-stone-700 font-black text-base transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm font-black text-stone-900 w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="cursor-pointer w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white font-black text-base transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-base font-black text-stone-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Footer */}
                <div className="p-4 border-t border-stone-100 space-y-3 bg-white">
                  {/* Bill Summary */}
                  <div className="rounded-2xl border border-orange-100 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400 font-semibold">Subtotal ({cartCount} items)</span>
                      <span className="font-bold text-stone-700">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-400">GST & charges</span>
                      <span className="text-stone-400">As applicable</span>
                    </div>
                    <div className="border-t border-orange-100 pt-2.5 flex justify-between">
                      <span className="font-black text-stone-900">Total</span>
                      <span className="font-black text-orange-500 text-lg">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* WhatsApp Order Button */}
                  <button
                    onClick={sendWhatsApp}
                    className="cursor-pointer w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-black flex items-center justify-center gap-2.5 transition-all shadow-lg text-[15px]"
                  >
                    <WhatsAppIcon />
                    Order via WhatsApp
                  </button>

                  <button
                    onClick={() => setCart([])}
                    className="cursor-pointer w-full py-2.5 rounded-xl text-stone-300 hover:text-red-400 text-sm font-semibold transition-colors hover:bg-red-50"
                  >
                    Clear all items
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Floating Cart Bar ───────────────────────────────────── */}
      {cart.length > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:bottom-6 sm:left-auto sm:right-6 sm:p-0">
          <button
            onClick={() => setCartOpen(true)}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white px-5 py-4 rounded-2xl shadow-2xl transition-all sm:rounded-full sm:py-3.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-orange-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                {cartCount}
              </span>
              <span className="font-bold text-sm">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base">₹{total.toLocaleString("en-IN")}</span>
              <WhatsAppIcon />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
