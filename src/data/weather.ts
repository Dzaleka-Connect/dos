export type WeatherCurrent = {
  temperature: string;
  minTemperature: string;
  maxTemp: string;
  condition: string;
  time: string;
  rainfall: string;
  windSpeed: string;
  windDirection: string;
};

export type WeatherApiResponse = {
  location: string;
  date: string;
  forecast: {
    current: WeatherCurrent;
    hourly: WeatherCurrent[];
  };
  lastUpdated: string;
  stale: boolean;
  source: 'met-malawi-live' | 'seasonal-fallback';
  sourceLabel: string;
  sourceNote: string;
};

export type WeatherAlert = {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'severe';
  publishedAt?: string;
  fallback?: boolean;
};

export const monthlyClimateData = [
  { month: 'January', high: 28, low: 18, rainfall: 250, humidity: '75%', notes: 'Peak rainy season with heavy downpours and standing water.', icon: 'Rain' },
  { month: 'February', high: 28, low: 18, rainfall: 220, humidity: '78%', notes: 'Wet conditions continue and roads can become difficult.', icon: 'Rain' },
  { month: 'March', high: 27, low: 17, rainfall: 180, humidity: '75%', notes: 'Rain begins to ease but storms are still common.', icon: 'Showers' },
  { month: 'April', high: 26, low: 15, rainfall: 80, humidity: '70%', notes: 'Transition month between wet and dry periods.', icon: 'Mixed' },
  { month: 'May', high: 24, low: 12, rainfall: 15, humidity: '65%', notes: 'Dry season begins and nights become cooler.', icon: 'Dry' },
  { month: 'June', high: 22, low: 9, rainfall: 5, humidity: '60%', notes: 'Coldest period of the year, especially overnight.', icon: 'Cold' },
  { month: 'July', high: 22, low: 9, rainfall: 5, humidity: '55%', notes: 'Clear skies, cool mornings, and dry air.', icon: 'Cold' },
  { month: 'August', high: 24, low: 11, rainfall: 5, humidity: '50%', notes: 'Dry conditions continue and daytime warmth returns.', icon: 'Dry' },
  { month: 'September', high: 27, low: 14, rainfall: 10, humidity: '45%', notes: 'Hotter afternoons and dust become more noticeable.', icon: 'Dry' },
  { month: 'October', high: 29, low: 16, rainfall: 40, humidity: '55%', notes: 'Build-up season with heat and first isolated rains.', icon: 'Mixed' },
  { month: 'November', high: 30, low: 18, rainfall: 120, humidity: '65%', notes: 'Rainy season starts and drainage becomes important.', icon: 'Rain' },
  { month: 'December', high: 29, low: 18, rainfall: 200, humidity: '70%', notes: 'Heavy rain returns and storm activity increases.', icon: 'Rain' },
] as const;

export const seasonalSections = [
  {
    title: 'Wet Season',
    range: 'November to April',
    summary: 'Hotter days, high humidity, and the heaviest rainfall of the year.',
    points: [
      'Expect daytime temperatures around 25 to 30 C with frequent storms.',
      'Flooding risk rises in low-lying or poorly drained parts of the camp.',
      'Standing water and damp shelter conditions can quickly become health issues.',
    ],
  },
  {
    title: 'Dry Season',
    range: 'May to October',
    summary: 'Milder days, cold nights, and very little rainfall.',
    points: [
      'Daytime temperatures are usually comfortable, but June and July nights can be cold.',
      'Dust, dryness, and water storage become more important practical concerns.',
      'Clear skies make travel easier, but low overnight temperatures can still be hard on families without warm bedding.',
    ],
  },
] as const;

export const practicalGuidance = [
  {
    title: 'For the wet months',
    items: [
      'Clear drainage around shelters before heavy rain arrives.',
      'Keep food, documents, and bedding raised off the ground where possible.',
      'Watch for mosquito exposure after rain and standing water.',
    ],
  },
  {
    title: 'For the dry months',
    items: [
      'Prepare for cold nights in June and July, especially for children and older residents.',
      'Store water carefully and protect containers from dust.',
      'Use shade and ventilation strategies during the hotter build-up months such as September and October.',
    ],
  },
] as const;

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function isWetSeason(date: Date) {
  const month = date.getMonth();
  return month >= 10 || month <= 3;
}

export function getSeasonalFallbackWeather(date = new Date()): WeatherApiResponse {
  const wetSeason = isWetSeason(date);

  return {
    location: 'Dzaleka Refugee Camp, Dowa District',
    date: formatDisplayDate(date),
    forecast: {
      current: {
        temperature: wetSeason ? '27' : '23',
        minTemperature: wetSeason ? '18' : '10',
        maxTemp: wetSeason ? '30' : '25',
        condition: wetSeason ? 'Seasonal rainy pattern' : 'Seasonal dry pattern',
        time: 'Seasonal guidance',
        rainfall: wetSeason ? '20' : '1',
        windSpeed: wetSeason ? '14' : '11',
        windDirection: wetSeason ? 'ESE' : 'SE',
      },
      hourly: [],
    },
    lastUpdated: date.toISOString(),
    stale: true,
    source: 'seasonal-fallback',
    sourceLabel: 'Seasonal climate guidance',
    sourceNote:
      'Live weather data from MET Malawi is temporarily unavailable, so this page is showing a seasonal Dzaleka snapshot based on typical monthly conditions.',
  };
}

export function getSeasonalFallbackAlerts(date = new Date()): WeatherAlert[] {
  const wetSeason = isWetSeason(date);

  if (wetSeason) {
    return [
      {
        title: 'Seasonal watch: heavy rain and drainage risk',
        description:
          'During the wet season, low-lying ground can flood quickly after storms. Check drainage paths, keep bedding dry, and watch for standing water.',
        type: 'warning',
        publishedAt: date.toISOString(),
        fallback: true,
      },
      {
        title: 'Seasonal health reminder',
        description:
          'Rainy months can bring more mosquitoes and damp shelter conditions. Protect stored water, bedding, and sleeping areas where possible.',
        type: 'info',
        publishedAt: date.toISOString(),
        fallback: true,
      },
    ];
  }

  return [
    {
      title: 'Seasonal watch: cold nights and dry air',
      description:
        'In the dry season, mornings and nights can be much colder than afternoon temperatures suggest. Warm layers and blankets matter most in June and July.',
      type: 'info',
      publishedAt: date.toISOString(),
      fallback: true,
    },
    {
      title: 'Seasonal dust and water reminder',
      description:
        'Dry months usually mean clearer roads but more dust and a greater need for careful water storage and shade during hotter afternoons.',
      type: 'info',
      publishedAt: date.toISOString(),
      fallback: true,
    },
  ];
}
