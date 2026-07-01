// Morocco's 12 administrative regions and their main cities.
// Used by the searchable, dependent Region/City selector.
export const MOROCCO_REGIONS: Record<string, string[]> = {
  "Tanger-Tétouan-Al Hoceïma": [
    "Tanger", "Tétouan", "Al Hoceïma", "Larache", "Chefchaouen",
    "Ouezzane", "Fnideq", "M'diq", "Ksar El Kébir", "Asilah",
  ],
  "Oriental": [
    "Oujda", "Nador", "Berkane", "Taourirt", "Jerada",
    "Driouch", "Guercif", "Figuig", "Bouarfa", "Ahfir", "Saïdia", "Zaïo",
  ],
  "Fès-Meknès": [
    "Fès", "Meknès", "Taza", "Sefrou", "Ifrane",
    "El Hajeb", "Moulay Yacoub", "Taounate", "Boulemane",
  ],
  "Rabat-Salé-Kénitra": [
    "Rabat", "Salé", "Kénitra", "Témara", "Skhirat",
    "Sidi Kacem", "Sidi Slimane", "Khémisset",
  ],
  "Béni Mellal-Khénifra": [
    "Béni Mellal", "Khénifra", "Khouribga", "Fquih Ben Salah", "Azilal", "Kasba Tadla",
  ],
  "Casablanca-Settat": [
    "Casablanca", "Settat", "Mohammedia", "El Jadida", "Berrechid",
    "Benslimane", "Nouaceur", "Médiouna", "Sidi Bennour", "Azemmour",
  ],
  "Marrakech-Safi": [
    "Marrakech", "Safi", "Essaouira", "El Kelâa des Sraghna",
    "Youssoufia", "Chichaoua", "Ben Guerir", "Rehamna",
  ],
  "Drâa-Tafilalet": [
    "Errachidia", "Ouarzazate", "Zagora", "Tinghir", "Midelt", "Rissani", "Erfoud",
  ],
  "Souss-Massa": [
    "Agadir", "Inezgane", "Taroudant", "Tiznit", "Oulad Teima",
    "Aït Melloul", "Biougra", "Chtouka Aït Baha",
  ],
  "Guelmim-Oued Noun": [
    "Guelmim", "Tan-Tan", "Sidi Ifni", "Assa", "Bouizakarne",
  ],
  "Laâyoune-Sakia El Hamra": [
    "Laâyoune", "Boujdour", "Es-Semara", "Tarfaya",
  ],
  "Dakhla-Oued Ed-Dahab": [
    "Dakhla", "Aousserd",
  ],
}

export const MOROCCO_REGION_NAMES: string[] = Object.keys(MOROCCO_REGIONS)

export const ALL_MOROCCO_CITIES: string[] = Object.values(MOROCCO_REGIONS)
  .flat()
  .sort((a, b) => a.localeCompare(b))

// Reverse lookup: city -> region (for the "pick a city, region auto-fills" flow).
export const CITY_TO_REGION: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const [region, cities] of Object.entries(MOROCCO_REGIONS)) {
    for (const city of cities) map[city] = region
  }
  return map
})()
