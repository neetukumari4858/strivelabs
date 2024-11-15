import { useState } from 'react';
import { apiUrl, API_KEY, languageUrl, worldBankDataUrl } from '../utils/apis'

export const useGetApis = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [regionMenu, setRegionMenu] = useState<string[]>([]);
  const [populationRanges, setPopulationRanges] = useState<string[]>([]);
  const [areaRanges, setAreaRanges] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [viewAll, setViewAll] = useState(false);
  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    language: '',
    region: '',
    population: '',
    area: ''
  })
  const fetchWorldBankData = async (indicator: string) => {
    let data: any[] = [];
    let page = 1;
    let totalPages = 1;
    try {
      while (page <= totalPages) {
        const response = await fetch(`${worldBankDataUrl}country/all/indicator/${indicator}?format=json&date=2021&page=${page}`);
        if (!response.ok) throw new Error(`Failed to fetch World Bank data for ${indicator}`);
        const result = await response.json();

        if (result[1]) {
          data = data.concat(result[1]);
          totalPages = result[0].pages;
        } else {
          break;
        }
        page++;
      }
    } catch (err) {
      console.error('Error fetching World Bank data:', err);
      return []; // Return empty array if fetching fails
    }
    return data;
  };
  const fetchLanguages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${languageUrl}all`);
      if (!response.ok) {
        throw new Error('Failed to fetch countries data');
      }
      const countryData = await response.json();
      const formattedCountries = countryData.map((country: any) => {
        return {
          name: country.name.common,
          languages: country.languages ? Object.values(country.languages) : [],
        };
      });
      const allLanguages = formattedCountries
        .flatMap((country: any) => country.languages)
        .filter((lang: string) => lang)
        .reduce((acc: string[], lang: string) => {
          if (!acc.includes(lang)) acc.push(lang);
          return acc;
        }, []);
      setLanguages(allLanguages);
      return formattedCountries
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to fetch countries data");
    } finally {
      setIsLoading(false);
    }
  };


  const getAllCountries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch Country Layer API data
      const apiResponse = await fetch(`${apiUrl}/all?access_key=${API_KEY}`);
      if (!apiResponse.ok) {
        throw new Error(`Country Layer API error : ${apiResponse.statusText}`);
      }
      const apiCountries = await apiResponse.json();

      if (!Array.isArray(apiCountries)) {
        throw new Error('API did not return an array of countries');
      }
      const populationData = await fetchWorldBankData("SP.POP.TOTL");
      const areaData = await fetchWorldBankData("AG.LND.TOTL.K2");
      const languageData = await fetchLanguages();
      // Merge the data
      const mergedCountries = apiCountries.map((apiCountry: { name: string; region: string }) => {
        const normalizedName = apiCountry.name.toLowerCase().trim();
        const populationMatch = populationData.find((wbCountry: { country: { value: string } }) =>
          wbCountry.country.value.toLowerCase().trim() === normalizedName
        );
        const areaMatch = areaData.find((areaCountry: { country: { value: string } }) =>
          areaCountry.country.value.toLowerCase().trim() === normalizedName
        );
        const lang = languageData.find((country: any) => country.name === apiCountry.name)
        return {
          ...apiCountry,
          population: populationMatch && populationMatch.value,
          area: areaMatch && areaMatch.value,
          languages: lang && lang.languages,
        };
      });
      setCountries(mergedCountries);
      setAllCountries(mergedCountries)
      // Extract unique regions, populations, and areas
      const uniqueRegions: any = Array.from(new Set(mergedCountries.map((country: any) => country.region))).filter(Boolean);
      setRegionMenu(uniqueRegions);
      const uniquePopulations: any = Array.from(new Set(mergedCountries.map((country: any) => country.population))).filter(Boolean);
      setPopulationRanges(uniquePopulations);
      const uniqueAreas: any = Array.from(new Set(mergedCountries.map((country: any) => country.area))).filter(Boolean);
      setAreaRanges(uniqueAreas);
    } catch (error: any) {
      setError(`Failed to fetch country data: ${error.message || 'Unknown error'}`);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: any) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const matches: any = countries.filter((country: any) =>
        country?.name.toLowerCase().includes(query.toLowerCase())
      );
      if (matches.length > 5) {
        setViewAll(true)
      }
      setFilteredCountries(matches);
      setCountries(matches.slice(0, 5))
      setShowSuggestions(true);
    } else {
      setFilteredCountries([]);
      getAllCountries()
      setShowSuggestions(false);
    }
    handleFetchData();
  };

  const getCountryByName = async (countryName: any, getText: boolean) => {
    try {
      const res = await fetch(`${apiUrl}/name/${countryName}?access_key=${API_KEY}&fullText=${getText}`);
      if (!res.ok) {
        throw new Error('Country not found!');
      }
      const data = await res.json();
      setCountries(data);
      setIsLoading(false);
      setShowSuggestions(false)
      setError("");
    } catch (error: any) {
      setIsLoading(false);
      setError(error.type);
    }
  };

  const handleViewAll = () => {
    setCountries(filteredCountries)
    setShowSuggestions(false)
  };

  const handleFetchData = async (handleClose?: () => void | undefined) => {
    const filteredData = allCountries.filter((country) => {
      const matchesSearch = searchQuery ? country.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesLanguage = filter.language
        ? country.languages?.some((lang: string) => lang === filter.language)
        : true;
      const matchesRegion = filter.region ? country.region === filter.region : true;
      const matchesPopulation = filter.population ? country.population === parseInt(filter.population) : true;
      const matchesArea = filter.area ? country.area === parseInt(filter.area) : true;
      return matchesSearch && matchesLanguage && matchesRegion && matchesPopulation && matchesArea;
    });
    setCountries(filteredData);
    if (handleClose) handleClose();
  };

  return { getAllCountries, handleSearchChange, languages, allCountries, setShowSuggestions, setSearchQuery, viewAll, regionMenu, populationRanges, areaRanges, getCountryByName, handleViewAll, handleFetchData, countries, filteredCountries, searchQuery, isLoading, error, showSuggestions, filter, setFilter }
}
