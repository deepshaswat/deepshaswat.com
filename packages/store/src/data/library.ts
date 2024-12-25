const books = [
  {
    name: "Classic",
    items: [
      // {
      //   title: "Black August",
      //   author: "Gil Scott-Heron",
      //   language: "English",
      //   description: "A novel about political activism and social justice.",
      //   url: "",
      // },
      {
        title: "David Copperfield",
        author: "Charles Dickens",
        language: "English",
        description:
          "A classic novel following the life of the titular character from childhood to maturity.",
        url: "https://amzn.to/4duSean",
      },
      {
        title: "Malgudi Days",
        author: "R.K. Narayan",
        language: "English",
        description:
          "A collection of short stories set in the fictional town of Malgudi.",
        url: "https://amzn.to/3Wu1rsH",
      },
      {
        title: "Michelangelo - Poems",
        author: "Michelangelo Buonarroti",
        language: "English",
        description:
          "A collection of poems by the renowned Renaissance artist.",
        url: "https://amzn.to/4djccoG",
      },
      {
        title: "Oliver Twist",
        author: "Charles Dickens",
        language: "English",
        description: "A novel about an orphan boy's adventures in London.",
        url: "https://amzn.to/3SAVlpj",
      },
      {
        title: "The Adventures Of Huckleberry Finn",
        author: "Mark Twain",
        language: "English",
        description:
          "A novel following the adventures of a young boy and a runaway slave on the Mississippi River.",
        url: "https://amzn.to/4cY4rol",
      },
      {
        title: "The Complete Works Of William Shakespeare",
        author: "William Shakespeare",
        language: "English",
        description:
          "The entire collection of plays, sonnets, and poems by the Bard of Avon.",
        url: "https://amzn.to/3WR6XHy",
      },
      {
        title: "The Old Man And The Sea",
        author: "Ernest Hemingway",
        language: "English",
        description:
          "A novel about an aging fisherman who struggles with a giant marlin.",
        url: "https://amzn.to/3ybR6tC",
      },
      {
        title: "Treasure Island",
        author: "Robert Louis Stevenson",
        language: "English",
        description:
          "A classic adventure novel about pirates and buried treasure.",
        url: "https://amzn.to/3SAObkZ",
      },
      {
        title: "Ulysses",
        author: "James Joyce",
        language: "English",
        description:
          "A complex and groundbreaking novel set in a single day in Dublin.",
        url: "https://amzn.to/4doU4cY",
      },
      {
        title: "Walden",
        author: "Henry David Thoreau",
        language: "English",
        description: "A reflection on simple living in natural surroundings.",
        url: "https://amzn.to/4duoLOa",
      },
      {
        title: "Walking",
        author: "Henry David Thoreau",
        language: "English",
        description:
          "An essay advocating for the enjoyment and preservation of nature.",
        url: "https://amzn.to/4frTwF3",
      },
      {
        title: "War And Peace",
        author: "Leo Tolstoy",
        language: "English",
        description:
          "An epic novel about the French invasion of Russia and its impact on Russian society.",
        url: "https://amzn.to/3WwTa7j",
      },
    ],
  },
  {
    name: "Dystopian",
    items: [
      {
        title: "1984",
        author: "George Orwell",
        language: "English",
        description:
          "A dystopian novel exploring the dangers of totalitarianism and extreme political ideology.",
        url: "https://amzn.to/3YtRCxK",
      },
      {
        title: "A Brave New World",
        author: "Aldous Huxley",
        language: "English",
        description:
          "A dystopian novel that critiques modern society by depicting a future world of technological and genetic control.",
        url: "https://amzn.to/3LNwg6G",
      },
      {
        title: "Animal Farm",
        author: "George Orwell",
        language: "English",
        description:
          "A satirical allegory about the rise of totalitarianism, depicted through a farm animal rebellion.",
        url: "https://amzn.to/4c5dbry",
      },
      {
        title: "India's External Intelligence",
        author: "V. K. Singh",
        language: "English",
        description: "A detailed account of India's intelligence agency, RAW.",
        url: "https://amzn.to/3yw0Nmw",
      },
      {
        title: "Why I Am An Atheist",
        author: "Bhagat Singh",
        language: "English",
        description:
          "An essay explaining the author's reasons for rejecting religious beliefs.",
        url: "https://amzn.to/3Sxg1i5",
      },
    ],
  },
  {
    name: "Financial Education",
    items: [
      {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        language: "English",
        description:
          "A personal finance book advocating for financial literacy and independence.",
        url: "https://amzn.to/3LOrYMw",
      },
      {
        title: "The Intelligent Investor",
        author: "Benjamin Graham",
        language: "English",
        description:
          "A comprehensive guide to value investing and financial management.",
        url: "https://amzn.to/3WMwgtY",
      },
      {
        title: "The Richest Man In Babylon",
        author: "George S. Clason",
        language: "English",
        description:
          "A series of financial parables set in ancient Babylon, offering advice on wealth building.",
        url: "https://amzn.to/3ywMJcr",
      },
      {
        title: "Why The Rich Are Getting Richer",
        author: "Robert Kiyosaki",
        language: "English",
        description:
          "An analysis of the financial strategies that keep the wealthy growing their wealth.",
        url: "https://amzn.to/4d74uOO",
      },
    ],
  },
  {
    name: "Fiction",
    items: [
      {
        title: "A Thousand Splendid Suns",
        author: "Khaled Hosseini",
        language: "English",
        description:
          "A novel set in Afghanistan, detailing the lives and struggles of two women across different generations.",
        url: "https://amzn.to/3Stm1rV",
      },
      {
        title: "And The Mountains Echoed",
        author: "Khaled Hosseini",
        language: "English",
        description:
          "A multi-generational family saga that explores the bonds that define us and shape our lives.",
        url: "https://amzn.to/46zekXm",
      },
      {
        title: "Anything For You, Ma'am",
        author: "Tushar Raheja",
        language: "English",
        description:
          "A romantic comedy about the lengths one young man will go to win the heart of his beloved.",
        url: "https://amzn.to/4fvpMHl",
      },
      {
        title: "Brisingr",
        author: "Christopher Paolini",
        language: "English",
        description:
          "The third book in the Inheritance Cycle, following the adventures of Eragon.",
        url: "https://amzn.to/4fscfAm",
      },
      {
        title: "Deception Point",
        author: "Dan Brown",
        language: "English",
        description:
          "A thriller involving a NASA discovery that could impact the presidential election.",
        url: "https://amzn.to/3YxUuJR",
      },
      {
        title: "Eldest",
        author: "Christopher Paolini",
        language: "English",
        description:
          "The second book in the Inheritance Cycle, continuing the journey of Eragon.",
        url: "https://amzn.to/3Yu3Q9v",
      },
      {
        title: "Eragon",
        author: "Christopher Paolini",
        language: "English",
        description:
          "The first book in the Inheritance Cycle, introducing Eragon and his dragon, Saphira.",
        url: "https://amzn.to/4fIk9WD",
      },
      {
        title: "Fractal Noise",
        author: "Christopher Paolini",
        language: "English",
        description:
          "A science fiction novel exploring themes of chaos and order.",
        url: "https://amzn.to/46AMN7F",
      },
      {
        title: "Harry Potter And The Half Blood Prince",
        author: "J.K. Rowling",
        language: "English",
        description:
          "The sixth book in the Harry Potter series, uncovering the past of Lord Voldemort.",
        url: "https://amzn.to/3Yom506",
      },
      {
        title: "I Too Had A Love Story",
        author: "Ravinder Singh",
        language: "English",
        description:
          "A romantic novel based on the author's real-life love story.",
        url: "https://amzn.to/3SxWy0G",
      },
      {
        title: "Inheritance",
        author: "Christopher Paolini",
        language: "English",
        description:
          "The final book in the Inheritance Cycle, concluding the saga of Eragon.",
        url: "https://amzn.to/3WOLC1l",
      },
      {
        title: "Kane And Abel",
        author: "Jeffrey Archer",
        language: "English",
        description:
          "A novel following the lives of two men born on the same day but into very different circumstances.",
        url: "https://amzn.to/4cgq5Tr",
      },
      {
        title: "Like It Happened Yesterday",
        author: "Ravinder Singh",
        language: "English",
        description:
          "A nostalgic look at the author's childhood and formative years.",
        url: "https://amzn.in/d/aRKfn4L",
      },
      {
        title: "Lolita",
        author: "Vladimir Nabokov",
        language: "English",
        description:
          "A controversial novel about a man's obsession with a young girl.",
        url: "https://amzn.to/3A6zMXo",
      },
      {
        title: "Love Story",
        author: "Erich Segal",
        language: "English",
        description:
          "A romantic tragedy about a wealthy young man and a poor young woman.",
        url: "https://amzn.to/46y28WP",
      },
      {
        title: "Love Story That Touched My Heart",
        author: "Ravinder Singh",
        language: "English",
        description: "An anthology of love stories curated by the author.",
        url: "https://amzn.to/3WtfJK9",
      },
      {
        title: "Murtagh",
        author: "Christopher Paolini",
        language: "English",
        description:
          "A novel focusing on the character Murtagh from the Inheritance Cycle.",
        url: "https://amzn.to/3yzumUh",
      },
      {
        title: "Nature",
        author: "Ralph Waldo Emerson",
        language: "English",
        description:
          "An essay advocating for the appreciation of nature and self-reliance.",
        url: "https://amzn.to/3yr6Dpj",
      },
      {
        title: "Origin",
        author: "Dan Brown",
        language: "English",
        description:
          "A thriller exploring the intersection of science, religion, and art.",
        url: "https://amzn.to/4caBVPb",
      },
      {
        title: "Raavan",
        author: "Amish Tripathi",
        language: "English",
        description:
          "A retelling of the story of Raavan, the antagonist of the Ramayana.",
        url: "https://amzn.to/3YwjJfO",
      },
      {
        title: "Ram",
        author: "Amish Tripathi",
        language: "English",
        description:
          "A retelling of the story of Ram, the hero of the Ramayana.",
        url: "https://amzn.to/3LRuBgK",
      },
      {
        title: "Revolution 2020",
        author: "Chetan Bhagat",
        language: "English",
        description:
          "A novel about love, corruption, and ambition in contemporary India.",
        url: "https://amzn.to/3LSEBGt",
      },
      {
        title: "Sita",
        author: "Amish Tripathi",
        language: "English",
        description:
          "A novel reimagining the life of Sita, a central character in the Ramayana.",
        url: "https://amzn.to/3A8axnL",
      },
      {
        title: "Strange Conflict",
        author: "Dennis Wheatley",
        language: "English",
        description:
          "A supernatural thriller involving black magic and espionage.",
        url: "https://amzn.to/3LQw3je",
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        language: "English",
        description:
          "A novel about a young shepherd's journey to find treasure and fulfill his destiny.",
        url: "https://amzn.to/4dmYwtn",
      },
      {
        title: "The Best Of Khalil Gibran",
        author: "Khalil Gibran",
        language: "English",
        description:
          "A collection of writings by the renowned Lebanese-American poet and philosopher.",
        url: "https://amzn.to/3ynQfpD",
      },
      {
        title: "The Complete Sherlock Holmes",
        author: "Arthur Conan Doyle",
        language: "English",
        description:
          "The complete collection of stories featuring the famous detective Sherlock Holmes.",
        url: "https://amzn.to/4ddhrXu",
      },
      {
        title: "The Devils Rides Out",
        author: "Dennis Wheatley",
        language: "English",
        description: "A horror novel involving black magic and the occult.",
        url: "https://amzn.to/46DOukY",
      },
      {
        title: "The Eiger Sanction",
        author: "Trevanian",
        language: "English",
        description:
          "A thriller involving an art professor who is also an assassin.",
        url: "https://amzn.to/4d9Ap0Q",
      },
      {
        title: "The Fault In Our Stars",
        author: "John Green",
        language: "English",
        description:
          "A romantic novel about two teenagers with cancer who fall in love.",
        url: "https://amzn.to/3WtJpXO",
      },
      {
        title: "The Fork, The Witch And The Worm",
        author: "Christopher Paolini",
        language: "English",
        description:
          "A collection of short stories set in the world of Alagaësia.",
        url: "https://amzn.to/3SyuIRS",
      },
      {
        title: "The Girl On The Train",
        author: "Paula Hawkins",
        language: "English",
        description:
          "A psychological thriller about a woman who becomes entangled in a missing person's investigation.",
        url: "https://amzn.to/3SAdnIe",
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        language: "English",
        description:
          "A fantasy novel about the adventures of Bilbo Baggins, a hobbit who embarks on a quest to win a share of a treasure guarded by a dragon.",
        url: "https://amzn.to/3yom0ii",
      },
      {
        title: "The Immortals Of Meluha",
        author: "Amish Tripathi",
        language: "English",
        description:
          "A novel set in ancient India, reimagining the story of the Hindu god Shiva.",
        url: "https://amzn.to/3SuNIkn",
      },
      {
        title: "The Iron Daughter",
        author: "Julie Kagawa",
        language: "English",
        description:
          "A fantasy novel about a young girl caught in the conflict between the Summer and Winter Courts of the faery world.",
        url: "https://amzn.to/3SvyRpK",
      },
      {
        title: "The Iron King",
        author: "Julie Kagawa",
        language: "English",
        description:
          "The first book in the Iron Fey series, following the journey of Meghan Chase into the world of the faeries.",
        url: "https://amzn.to/4fIxkqz",
      },
      {
        title: "The Iron Queen",
        author: "Julie Kagawa",
        language: "English",
        description:
          "A fantasy novel where Meghan Chase must face the challenges of being a faery queen.",
        url: "https://amzn.to/4fxlI9u",
      },
      {
        title: "The Journey To Nowhere",
        author: "Diptangshu Das",
        language: "English",
        description:
          "A story of a young couple, fighting against all odds for their love.",
        url: "https://amzn.in/d/b0R0arK",
      },
      {
        title: "The Kite Runner",
        author: "Khaled Hosseini",
        language: "English",
        description:
          "A novel about friendship and redemption set in Afghanistan.",
        url: "https://amzn.to/3yswahV",
      },
      {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        language: "English",
        description:
          "The first book in the epic fantasy trilogy, introducing the quest to destroy the One Ring.",
        url: "https://amzn.to/3yom0ii",
      },
      {
        title: "The Lord of the Rings: The Return of the King",
        author: "J.R.R. Tolkien",
        language: "English",
        description:
          "The final book in the trilogy, concluding the epic quest and the battle for Middle-earth.",
        url: "https://amzn.to/3yom0ii",
      },
      {
        title: "The Lord of the Rings: The Two Towers",
        author: "J.R.R. Tolkien",
        language: "English",
        description:
          "The second book in the trilogy, following the separate journeys of the fellowship members.",
        url: "https://amzn.to/3yom0ii",
      },
      {
        title: "The Lost Scraps Of Love",
        author: "Nipun Ranjanr",
        language: "English",
        description:
          "A love story during the time of Scraps before Facebook and Instagram.",
        url: "https://amzn.to/3SyISSZ",
      },
      {
        title: "The Secret Of The Nagas",
        author: "Amish Tripathi",
        language: "English",
        description:
          "The second book in the Shiva Trilogy, continuing the story of Shiva's quest.",
        url: "https://amzn.to/3YslCKg",
      },
      {
        title: "To Kill A Mockingbird",
        author: "Harper Lee",
        language: "English",
        description:
          "A novel about racial injustice and moral growth in the American South.",
        url: "https://amzn.to/4dpP1ck",
      },
      {
        title: "To Sleep In A Sea Of Stars",
        author: "Christopher Paolini",
        language: "English",
        description:
          "A science fiction novel about space exploration and first contact with an alien species.",
        url: "https://amzn.to/3LNEyf9",
      },
      {
        title: "Twelve Red Herrings",
        author: "Jeffrey Archer",
        language: "English",
        description: "A collection of short stories with unexpected twists.",
        url: "https://amzn.to/4cakLkz",
      },
      {
        title: "Zero Percentile",
        author: "Neeraj Chhibba",
        language: "English",
        description:
          "A novel about the challenges and adventures of an Indian student in Russia.",
        url: "https://amzn.to/4c60UTP",
      },
    ],
  },
  {
    name: "Philosophical & Religious",
    items: [
      {
        title: "Autobiography Of A Yogi",
        author: "Paramahansa Yogananda",
        language: "English",
        description:
          "A spiritual classic detailing the life and experiences of Yogananda.",
        url: "https://amzn.to/3WMUft9",
      },
      {
        title: "Bhagwat Gita",
        author: "A.C. Bhaktivendanta Swami Prabhupada",
        language: "Sanskrit/Hindi",
        description:
          "A 700-verse Hindu scripture in Sanskrit that is part of the Indian epic Mahabharata.",
        url: "https://amzn.to/4dtdgGI",
      },
      {
        title: "Chanakaya Neeti",
        author: "Chanakya",
        language: "Sanskrit/Hindi",
        description:
          "An ancient Indian treatise on political science and ethics.",
        url: "https://amzn.to/4frLkER",
      },
      {
        title: "Letters From Stoic",
        author: "Seneca",
        language: "English",
        description:
          "A collection of letters offering insight into Stoic philosophy.",
        url: "https://amzn.to/4fvCS7t",
      },
      {
        title: "Meditations",
        author: "Marcus Aurelius",
        language: "English",
        description:
          "A series of personal writings by the Roman Emperor on Stoic philosophy.",
        url: "https://amzn.to/46wNJdi",
      },
      {
        title: "On The Shortness Of Life",
        author: "Seneca",
        language: "English",
        description:
          "A philosophical treatise on the nature of time and the importance of living wisely.",
        url: "https://amzn.to/46tJSOf",
      },
      {
        title: "The Art Of War",
        author: "Sun Tzu",
        language: "English",
        description:
          "An ancient Chinese military treatise on strategy and tactics.",
        url: "https://amzn.to/3WnN8pG",
      },
      {
        title: "The Autobiography Of Benjamin Franklin",
        author: "Benjamin Franklin",
        language: "English",
        description:
          "The memoirs of one of America's founding fathers, detailing his life and achievements.",
        url: "https://amzn.to/3WukPWK",
      },
      {
        title: "The Communist Manifesto",
        author: "Karl Marx and Friedrich Engels",
        language: "English",
        description:
          "A political pamphlet advocating for the principles of communism.",
        url: "https://amzn.in/d/9Cxg64K",
      },
      {
        title: "The Diary Of Anne Frank",
        author: "Anne Frank",
        language: "English",
        description:
          "The personal diary of a young Jewish girl hiding from the Nazis during World War II.",
        url: "https://amzn.to/3A8cjVX",
      },
      {
        title: "The Social Contract",
        author: "Jean-Jacques Rousseau",
        language: "English",
        description:
          "A philosophical treatise on the principles of political rights and democracy.",
        url: "https://amzn.to/3yoUdOH",
      },
    ],
  },
  {
    name: "Self-Help",
    items: [
      {
        title: "How To Win Friends And Influence People",
        author: "Dale Carnegie",
        language: "English",
        description:
          "A self-help book offering practical advice on interpersonal skills.",
        url: "https://amzn.to/4ca4P1K",
      },
      {
        title: "Start With Why",
        author: "Simon Sinek",
        language: "English",
        description:
          "A book exploring how leaders inspire action by starting with a clear sense of purpose.",
        url: "https://amzn.to/4dqh5fJ",
      },
      {
        title: "Stay Hungry Stay Foolish",
        author: "Rashmi Bansal",
        language: "English",
        description:
          "Stories of 25 IIM Ahmedabad graduates who chose to become entrepreneurs.",
        url: "https://amzn.to/3ymdAIk",
      },
      {
        title: "The 4-hour Work Week",
        author: "Timothy Ferriss",
        language: "English",
        description:
          "A self-help book advocating for lifestyle design and reducing work hours.",
        url: "https://amzn.to/3A20obV",
      },
      {
        title: "The Last Lecture",
        author: "Randy Pausch",
        language: "English",
        description:
          "A moving account of the author's life lessons delivered in his final lecture before his death.",
        url: "https://amzn.to/3A4A4hk",
      },
      {
        title: "The Monk Who Sold His Ferrari",
        author: "Robin Sharma",
        language: "English",
        description:
          "A fable about achieving personal and professional fulfillment.",
        url: "https://amzn.to/4djQykk",
      },
      {
        title: "Think And Grow Rich",
        author: "Napoleon Hill",
        language: "English",
        description:
          "A self-help book offering strategies for achieving financial success.",
        url: "https://amzn.to/4d4k8dJ",
      },
      {
        title: "Tuesday's With Morrie",
        author: "Mitch Albom",
        language: "English",
        description:
          "A memoir recounting the author's conversations with his dying former college professor.",
        url: "https://amzn.to/4dwkxFH",
      },
      {
        title: "Who Will Cry When You Die",
        author: "Robin Sharma",
        language: "English",
        description:
          "A self-help book offering life lessons and advice for personal growth.",
        url: "https://amzn.to/4d75ceL",
      },
      {
        title: "You Can Win",
        author: "Shiv Khera",
        language: "Hindi",
        description:
          "A self-help book providing strategies for personal and professional success.",
        url: "https://amzn.to/4fvVHYk",
      },
    ],
  },
  {
    name: "Science & Space",
    items: [
      {
        title: "A Brief History Of Time",
        author: "Stephen Hawking",
        language: "English",
        description:
          "An exploration of cosmology, explaining complex scientific concepts for a general audience.",
        url: "https://amzn.to/3LQ5Xgd",
      },
      {
        title: "Gateway To Ham Radio",
        author: "Joseph Mattappally",
        language: "English",
        description:
          "A guidebook for enthusiasts looking to start with ham radio.",
        url: "https://amzn.to/3WDfH2G",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        language: "English",
        description:
          "A brief history of humankind, exploring how Homo sapiens came to dominate the world.",
        url: "https://amzn.to/3WP6ZQa",
      },
      {
        title: "Wings Of Fire",
        author: "Abdul Kalam",
        language: "English",
        description:
          "A comprehensive guide to modern space exploration and technology.",
        url: "https://amzn.to/3SBZx8u",
      },
      {
        title: "The Theory Of Everything",
        author: "Stephen Hawking",
        language: "English",
        description:
          "A collection of lectures explaining the fundamental theories of the universe.",
        url: "https://amzn.to/3SA0IoZ",
      },
    ],
  },
];

export { books };
