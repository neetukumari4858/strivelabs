export const apiUrl='https://api.countrylayer.com/v2'
// export const API_KEY='ae6fe92c8537db8b7f4057781252c88e'
export const API_KEY = process.env.REACT_APP_API_KEY;

export const countryLanguageMapping: Record<string, string[]> = {
    India: ["hi", "en"],
    Spain: ["es"],
    France: ["fr"],
    Germany: ["de"],
    "United States": ["en"],
    Brazil: ["pt"],
    China: ["zh"],
    Japan: ["ja"],
  };