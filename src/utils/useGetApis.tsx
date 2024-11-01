import { useState } from 'react';

interface LanguageCodes {
  english: string;
  hindi: string;
  spanish: string;
  french: string;
  german: string;
}
export const languageCodes : LanguageCodes = {
    english: "en",
    hindi: "hi",
    spanish: "es",
    french: "fr",
    german: "de",
};
const apiUrl='https://api.countrylayer.com/v2'
const API_KEY='f99182cb453d80783a2ee684d4e966f2'

export  const useGetApis=()=>{
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filter,setFilter]=useState({
    language:'',
    region:''
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

  // useEffect(() => {
  //   getAllCountries();
  // }, []);

  const handleSearchChange = (e: any) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const matches = countries.filter((country:any) =>
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

  
  const getCountryByName = async (countryName: any,getText:boolean) => {
    
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
  
  const handleViewAll = (searchQuery:string,getText:boolean) => {
    getViewAll(searchQuery)
  };

  const handleFetchData = async () => {
    const langCode = languageCodes[filter.language as keyof typeof languageCodes];
    if (!langCode) {
      alert('Invalid language. Please enter a valid language name.');
      return;
    }
    
    try {
      const region = filter.region ? `&region=${filter.region}` : '';
      const response = await fetch(`${apiUrl}/lang/${langCode}?access_key=${API_KEY}${region}`);
      
      if (!response.ok) {
        throw new Error('Country not found!');
      }
      
      const data = await response.json();
      setCountries(data);
    } catch (error:any) {
      console.error('Error fetching data', error);
      setError(error.type);
    }
   };
  return {getAllCountries,handleSearchChange,getCountryByName,getViewAll,handleViewAll,handleFetchData,countries,filteredCountries,searchQuery,isLoading,error,showSuggestions,filter,setFilter}
}
