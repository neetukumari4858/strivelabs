import { useState } from 'react';

import { apiUrl, API_KEY } from '../utils/apis'
export const languageCodes: any = {
  english: "en",
  hindi: "hi",
  spanish: "es",
  french: "fr",
  german: "de",
};

export const useGetApis = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filter, setFilter] = useState({
    language: '',
    region: ''
  })

  const getAllCountries = async () => {
    try {
      const response = await fetch(`${apiUrl}/all?access_key=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCountries(data);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setError(error.type);
    }
  };

  const handleSearchChange = (e: any) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const matches: any = countries.filter((country: any) =>
        country?.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setFilteredCountries(matches);
      setShowSuggestions(true);
    } else {
      setFilteredCountries([]);
      getAllCountries()
      setShowSuggestions(false);
    }
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
      setError("");
    } catch (error: any) {
      setIsLoading(false);
      setError(error.type);
    }
  };

  const getViewAll = async (countryName: string) => {
    try {
      const res = await fetch(`${apiUrl}/name/${countryName}?access_key=${API_KEY}`);
      if (!res.ok) {
        throw new Error('Country not found!');
      }
      const data = await res.json();
      setCountries(data);
      setIsLoading(false);
      setError("");
    } catch (error: any) {
      setIsLoading(false);
      setError(error.type);
    }
  };

  const handleViewAll = (searchQuery: string, getText: boolean) => {
    getViewAll(searchQuery)
  };

  const getCountryByLanguage = async () => {
    const langCode = languageCodes[filter.language.toLowerCase()];
    if (!langCode) return;
    try {
      const response = await fetch(`${apiUrl}/lang/${langCode}?access_key=${API_KEY}`);
      if (!response.ok) throw new Error('Country not found');
      const data = await response.json();
      setCountries(data);
    } catch (error: any) {
      console.error('Error fetching language data:', error);
      setError(error.type);
    }
  }

  const getCountryByRegion = async () => {
    try {
      if (!filter.region) return;
      const response = await fetch(`${apiUrl}/region/${filter.region}?access_key=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Country not found!');
      }
      const data = await response.json();
      setCountries(data);
    } catch (error: any) {
      console.error('Error fetching data', error);
      setError(error.type);
    }
  }

  const handleFetchData = (handleClose: any) => {
    if (filter.language) {
      getCountryByLanguage();
    }
    if (filter.region) {
      getCountryByRegion()
    }
    handleClose()
  }
  return { getAllCountries, handleSearchChange, filter, getCountryByName, getViewAll, handleViewAll, handleFetchData, countries, filteredCountries, searchQuery, isLoading, error, showSuggestions, setFilter }
}
