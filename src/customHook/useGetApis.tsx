import { useState } from 'react';
import { apiUrl, API_KEY } from '../utils/apis'
import { countryLanguageMapping } from "../utils/apis"

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
  const [viewAll, setViewAll] = useState(false);
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
        const response = await fetch(`https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&date=2021&page=${page}`);
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
      // Merge the data
      const mergedCountries = apiCountries.map((apiCountry: { name: string; region: string }) => {
        const normalizedName = apiCountry.name.toLowerCase().trim();
        const populationMatch = populationData.find((wbCountry: { country: { value: string } }) =>
          wbCountry.country.value.toLowerCase().trim() === normalizedName
        );
        const areaMatch = areaData.find((areaCountry: { country: { value: string } }) =>
          areaCountry.country.value.toLowerCase().trim() === normalizedName
        );
        const languages = countryLanguageMapping[apiCountry.name] || [];
        return {
          ...apiCountry,
          population: populationMatch ? populationMatch.value : 'N/A',
          area: areaMatch ? areaMatch.value : 'N/A',
          languages,
        };
      });
      setCountries(mergedCountries);
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
      ).slice(0, 5);
      if (matches.length > 5) {
        setViewAll(true)
      }
      const matchesFiveCountry = matches.slice(0, 5);
      setFilteredCountries(matchesFiveCountry);
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

  const getViewAll = async (countryName: string) => {
    const matches: any = countries.filter((country: any) =>
      country?.name.toLowerCase().includes(countryName.toLowerCase())
    );
    setCountries(matches);
    setShowSuggestions(true);
    handleFetchData();
    setViewAll(false)
  };

  const handleViewAll = (searchQuery: string) => {
    getViewAll(searchQuery)
  };

  const handleFetchData = async (handleClose?: () => void | undefined) => {
    const filteredData = countries.filter((country) => {
      const matchesSearch = searchQuery ? country.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesLanguage = filter.language
        ? country.languages?.some((lang: string) => lang.toLowerCase() === filter.language.toLowerCase())
        : true;
      const matchesRegion = filter.region ? country.region === filter.region : true;
      const matchesPopulation = filter.population ? country.population === parseInt(filter.population) : true;
      const matchesArea = filter.area ? country.area === parseInt(filter.area) : true;
      return matchesSearch && matchesLanguage && matchesRegion && matchesPopulation && matchesArea;
    });
    setCountries(filteredData);
    if (handleClose) handleClose();
  };

  return { getAllCountries, handleSearchChange, setShowSuggestions, setSearchQuery, viewAll, regionMenu, populationRanges, areaRanges, getCountryByName, getViewAll, handleViewAll, handleFetchData, countries, filteredCountries, searchQuery, isLoading, error, showSuggestions, filter, setFilter }
}
