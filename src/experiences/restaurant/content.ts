/**
 * Maison Arden is a fictional restaurant: a Fluxline Interactive Concept. Names, dishes, prices,
 * hours, and capacities are illustrative, so a prospect can see a complete experience.
 */
export const RESTAURANT = {
  name: "Maison Arden",
  kicker: "Bistro & Wine Room",
  welcome: "Welcome in. Have a look around.",
  hours: [
    ["Tuesday to Thursday", "5 to 10 pm"],
    ["Friday and Saturday", "5 to 11 pm"],
    ["Sunday", "4 to 9 pm"],
  ],
  address: ["Main Street", "Long Island, New York"],
  phoneDisplay: "(516) 555-0188",
} as const;

export type Dish = { name: string; note: string; price: string };
export type Course = {
  id: string;
  numeral: string;
  title: string;
  dishes: Dish[];
};

export const COURSES: Course[] = [
  {
    id: "starters",
    numeral: "I",
    title: "Starters",
    dishes: [
      {
        name: "Burrata",
        note: "Charred peach, basil oil, grilled bread",
        price: "16",
      },
      {
        name: "Steak tartare",
        note: "Cured yolk, cornichon, rye crisp",
        price: "19",
      },
      {
        name: "Little gem",
        note: "White anchovy, crisp shallot, lemon",
        price: "14",
      },
    ],
  },
  {
    id: "pasta",
    numeral: "II",
    title: "Pasta",
    dishes: [
      {
        name: "Tagliatelle",
        note: "Littleneck clams, white wine, chili",
        price: "28",
      },
      {
        name: "Pappardelle",
        note: "Wild mushrooms, brown butter, sage",
        price: "26",
      },
      {
        name: "Agnolotti",
        note: "Sweet corn, chive, aged parmesan",
        price: "25",
      },
    ],
  },
  {
    id: "mains",
    numeral: "III",
    title: "Mains",
    dishes: [
      { name: "Sea bass", note: "Beurre blanc, spring greens", price: "36" },
      { name: "Roast chicken", note: "Pan jus, pommes purée", price: "31" },
      {
        name: "Steak frites",
        note: "Sauce au poivre, watercress",
        price: "42",
      },
    ],
  },
  {
    id: "dessert",
    numeral: "IV",
    title: "Dessert",
    dishes: [
      {
        name: "Tarte tatin",
        note: "Crème fraîche, salted caramel",
        price: "12",
      },
      { name: "Pot de crème", note: "Dark chocolate, sea salt", price: "11" },
      { name: "Cheese", note: "Three from the cave, honeycomb", price: "16" },
    ],
  },
  {
    id: "drinks",
    numeral: "V",
    title: "Wine & Cocktails",
    dishes: [
      {
        name: "Arden spritz",
        note: "Lillet rosé, grapefruit, soda",
        price: "14",
      },
      { name: "Smoked old fashioned", note: "Rye, maple, orange", price: "17" },
      {
        name: "Wine by the glass",
        note: "A short list that changes weekly",
        price: "from 13",
      },
    ],
  },
];

export const COCKTAILS: Dish[] = [
  { name: "Arden spritz", note: "Lillet rosé, grapefruit, soda", price: "14" },
  { name: "Negroni bianco", note: "Gin, bianco vermouth, suze", price: "16" },
  {
    name: "Smoked old fashioned",
    note: "Rye, maple, orange peel",
    price: "17",
  },
  { name: "Champagne cocktail", note: "Cognac, bitters, sugar", price: "18" },
];

export type EventType = {
  id: string;
  label: string;
  capacity: string;
  line: string;
  focus: { x: number; y: number };
  zoom: number;
};

export const EVENT_TYPES: EventType[] = [
  {
    id: "cocktail",
    label: "Cocktail event",
    capacity: "Up to 50 standing",
    line: "Passed plates, the bar opened to the salon, and the windows thrown open in summer.",
    focus: { x: 0.24, y: 0.42 },
    zoom: 1.28,
  },
  {
    id: "seated",
    label: "Seated dinner",
    capacity: "Up to 28 seated",
    line: "One long table or three rounds, a set menu from the kitchen, and wine pairings by the glass.",
    focus: { x: 0.72, y: 0.78 },
    zoom: 1.4,
  },
  {
    id: "party",
    label: "Private party",
    capacity: "The whole salon",
    line: "Birthdays, rehearsal dinners, and celebrations: the room is yours for the evening.",
    focus: { x: 0.5, y: 0.5 },
    zoom: 1.04,
  },
];
