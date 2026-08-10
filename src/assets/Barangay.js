const barangays = [
  {
    name: "Poblacion",
    location: { lat: 7.650087, lng: 123.267565 },
    puroks: [
      { name: "Bonifacio", location: { lat: 7.65065, lng: 123.26705 } },
      { name: "Rizal", location: { lat: 7.64965, lng: 123.26805 } },
      { name: "Gandawali", location: { lat: 7.65065, lng: 123.2681 } },
      { name: "Garcia", location: { lat: 7.64965, lng: 123.26705 } },
      { name: "Magsaysay", location: { lat: 7.6501, lng: 123.26855 } },
    ],
  },

  {
    name: "Sayog",
    location: { lat: 7.650382, lng: 123.246269 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.65095, lng: 123.24575 } },
      { name: "Purok 2", location: { lat: 7.64985, lng: 123.24675 } },
      { name: "Purok 3", location: { lat: 7.65095, lng: 123.24685 } },
      { name: "Purok 4", location: { lat: 7.64985, lng: 123.24575 } },
      { name: "Purok 5", location: { lat: 7.6504, lng: 123.24725 } },
    ],
  },

  {
    name: "Limonan",
    location: { lat: 7.68389, lng: 123.296657 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.68445, lng: 123.29615 } },
      { name: "Purok 2", location: { lat: 7.68335, lng: 123.29715 } },
      { name: "Purok 3", location: { lat: 7.68445, lng: 123.29725 } },
      { name: "Purok 4", location: { lat: 7.68335, lng: 123.29615 } },
      { name: "Purok 5", location: { lat: 7.6839, lng: 123.29765 } },
    ],
  },

  {
    name: "Libuganan",
    location: { lat: 7.661613, lng: 123.268802 },
    puroks: [
      {
        name: "Purok Bougainvillea",
        location: { lat: 7.66215, lng: 123.2683 },
      },
      {
        name: "Purok San Francisco",
        location: { lat: 7.6611, lng: 123.2693 },
      },
      {
        name: "Purok Mangga",
        location: { lat: 7.66215, lng: 123.26935 },
      },
      {
        name: "Purok Malanas",
        location: { lat: 7.6611, lng: 123.2683 },
      },
      {
        name: "Purok 5",
        location: { lat: 7.66165, lng: 123.2698 },
      },
    ],
  },

  {
    name: "Tapian",
    location: { lat: 7.616208, lng: 123.258393 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.61675, lng: 123.2579 } },
      { name: "Purok 2", location: { lat: 7.61565, lng: 123.2589 } },
      { name: "Purok 3", location: { lat: 7.61675, lng: 123.25895 } },
      { name: "Purok 4", location: { lat: 7.61565, lng: 123.2579 } },
      { name: "Purok 5", location: { lat: 7.6162, lng: 123.25945 } },
    ],
  },

  {
    name: "Bulawan",
    location: { lat: 7.626396, lng: 123.25099 },
    puroks: [
      { name: "Ipil-ipil", location: { lat: 7.62695, lng: 123.2505 } },
      { name: "Palmera", location: { lat: 7.62585, lng: 123.2515 } },
      { name: "Kamunggay", location: { lat: 7.62695, lng: 123.25155 } },
      { name: "Nangka", location: { lat: 7.62585, lng: 123.2505 } },
      { name: "Cacao", location: { lat: 7.6264, lng: 123.25205 } },
    ],
  },

  {
    name: "Calube",
    location: { lat: 7.645, lng: 123.292 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.64555, lng: 123.2915 } },
      { name: "Purok 2", location: { lat: 7.64445, lng: 123.2925 } },
      { name: "Purok 3", location: { lat: 7.64555, lng: 123.29255 } },
      { name: "Purok 4", location: { lat: 7.64445, lng: 123.2915 } },
      { name: "Purok 5", location: { lat: 7.645, lng: 123.293 } },
    ],
  },

  {
    name: "Mati",
    location: { lat: 7.704315, lng: 123.291506 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.70485, lng: 123.291 } },
      { name: "Purok 2", location: { lat: 7.70375, lng: 123.292 } },
      { name: "Purok 3", location: { lat: 7.70485, lng: 123.29205 } },
      { name: "Purok 4", location: { lat: 7.70375, lng: 123.291 } },
      { name: "Purok 5", location: { lat: 7.70432, lng: 123.29255 } },
    ],
  },

  {
    name: "Langilan",
    location: { lat: 7.68, lng: 123.284 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.68055, lng: 123.2835 } },
      { name: "Purok 2", location: { lat: 7.67945, lng: 123.2845 } },
      { name: "Purok 3", location: { lat: 7.68055, lng: 123.28455 } },
      { name: "Purok 4", location: { lat: 7.67945, lng: 123.2835 } },
      { name: "Purok 5", location: { lat: 7.68, lng: 123.285 } },
    ],
  },

  {
    name: "San Isidro",
    location: { lat: 7.64, lng: 123.282 },
    puroks: [
      { name: "Purok Uno", location: { lat: 7.64055, lng: 123.2815 } },
      { name: "Purok Dos", location: { lat: 7.63945, lng: 123.2825 } },
      { name: "Purok Tres", location: { lat: 7.64055, lng: 123.28255 } },
      { name: "Purok Kwatro", location: { lat: 7.63945, lng: 123.2815 } },
      { name: "Purok Singko", location: { lat: 7.64, lng: 123.283 } },
    ],
  },

  {
    name: "Fatima",
    location: { lat: 7.652, lng: 123.303 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.65255, lng: 123.3025 } },
      { name: "Purok 2", location: { lat: 7.65145, lng: 123.3035 } },
      { name: "Purok 3", location: { lat: 7.65255, lng: 123.30355 } },
      { name: "Purok 4", location: { lat: 7.65145, lng: 123.3025 } },
      { name: "Purok 5", location: { lat: 7.652, lng: 123.304 } },
    ],
  },

  {
    name: "Lantawan",
    location: { lat: 7.667, lng: 123.307 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.66755, lng: 123.3065 } },
      { name: "Purok 2", location: { lat: 7.66645, lng: 123.3075 } },
      { name: "Purok 3", location: { lat: 7.66755, lng: 123.30755 } },
      { name: "Purok 4", location: { lat: 7.66645, lng: 123.3065 } },
      { name: "Purok 5", location: { lat: 7.667, lng: 123.308 } },
    ],
  },

  {
    name: "Conception",
    location: { lat: 7.685, lng: 123.3 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.68555, lng: 123.2995 } },
      { name: "Purok 2", location: { lat: 7.68445, lng: 123.3005 } },
      { name: "Purok 3", location: { lat: 7.68555, lng: 123.30055 } },
      { name: "Purok 4", location: { lat: 7.68445, lng: 123.2995 } },
      { name: "Purok 5", location: { lat: 7.685, lng: 123.301 } },
    ],
  },

  {
    name: "Ocapan",
    location: { lat: 7.69, lng: 123.27 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.69055, lng: 123.2695 } },
      { name: "Purok 2", location: { lat: 7.68945, lng: 123.2705 } },
      { name: "Purok 3", location: { lat: 7.69055, lng: 123.27055 } },
      { name: "Purok 4", location: { lat: 7.68945, lng: 123.2695 } },
      { name: "Purok 5", location: { lat: 7.69, lng: 123.271 } },
    ],
  },

  {
    name: "Dumalian",
    location: { lat: 7.635, lng: 123.27 },
    puroks: [
      { name: "Purok Uno", location: { lat: 7.63555, lng: 123.2695 } },
      { name: "Purok Dos", location: { lat: 7.63445, lng: 123.2705 } },
      { name: "Purok Tres", location: { lat: 7.63555, lng: 123.27055 } },
      { name: "Purok Kwatro", location: { lat: 7.63445, lng: 123.2695 } },
      { name: "Purok Singko", location: { lat: 7.635, lng: 123.271 } },
    ],
  },

  {
    name: "Dao-an",
    location: { lat: 7.675841, lng: 123.293233 },
    puroks: [
      {
        name: "Purok Sta. Lucia",
        location: { lat: 7.6764, lng: 123.2927 },
      },
      {
        name: "Purok Matinabangon",
        location: { lat: 7.6753, lng: 123.29375 },
      },
      {
        name: "Purok Don Mariano",
        location: { lat: 7.6764, lng: 123.2938 },
      },
      {
        name: "Purok Makiangayon",
        location: { lat: 7.6753, lng: 123.2927 },
      },
      {
        name: "Purok San Francisco",
        location: { lat: 7.67585, lng: 123.29425 },
      },
    ],
  },

  {
    name: "Betinan",
    location: { lat: 7.62, lng: 123.28 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.62055, lng: 123.2795 } },
      { name: "Purok 2", location: { lat: 7.61945, lng: 123.2805 } },
      { name: "Purok 3", location: { lat: 7.62055, lng: 123.28055 } },
      { name: "Purok 4", location: { lat: 7.61945, lng: 123.2795 } },
      { name: "Purok 5", location: { lat: 7.62, lng: 123.281 } },
    ],
  },

  {
    name: "Laperian",
    location: { lat: 7.686378, lng: 123.274254 },
    puroks: [
      { name: "Purok 1", location: { lat: 7.68695, lng: 123.27375 } },
      { name: "Purok 2", location: { lat: 7.68585, lng: 123.27475 } },
      { name: "Purok 3", location: { lat: 7.68695, lng: 123.2748 } },
      { name: "Purok 4", location: { lat: 7.68585, lng: 123.27375 } },
      { name: "Purok 5", location: { lat: 7.68638, lng: 123.27525 } },
    ],
  },
];

export default barangays;
