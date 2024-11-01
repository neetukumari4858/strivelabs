import { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import { apiUrl, API_KEY } from "../utils/api";
import { Button } from "@mui/material";

const CountryDetails = () => {
  const [country, setCountry] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { countryName } = useParams();

  useEffect(() => {
    const getCountryByName = async () => {
      try {
        const res = await fetch(`${apiUrl}/name/${countryName}?access_key=${API_KEY}&fullText=true`);        
        if (!res.ok) {
          throw new Error('Could not found!');
        }

        const data = await res.json();
        
        setCountry(data);
        setIsLoading(false);
        setError("");
      } catch (error: any) {
        setIsLoading(false);
        setError(error.message);
      }
    };

    getCountryByName();
  }, [countryName]);

  return (
    <div>

       <Button>
        <Link to="/">Back</Link>
      </Button>
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          {country?.map((countryInfo: any) => (
            <div key={countryInfo.name}>
              <p>Country: {countryInfo.name}</p>
              <p>Domain: {countryInfo.topLevelDomain}</p>
              <p>capital: {countryInfo.capital}</p>
              <p>region :{countryInfo.region}</p>
              <p>Population, Area, Languages.</p>
            </div>
          ))}
        </>
      )}
    </div>
    </div>
  );
};

export default CountryDetails;