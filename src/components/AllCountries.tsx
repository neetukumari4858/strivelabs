import { useEffect, useState } from 'react';
import { apiUrl, API_KEY } from "../utils/api";
import { Button, Card, CardActions, CardContent, TextField, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import {languageCodes  } from "../utils/api"
const useStyles = makeStyles({
  flag: {
    borderRadius: '100%',
    height: 35,
    width: 40,
    backgroundColor: "black"
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  suggestions: {
    width: '100%',
    maxWidth: 360,
  },
  viewAllBtn: {
    textAlign: 'center',
    color: 'blue',
    cursor: 'pointer',
  },
 
});

const AllCountries = () => {
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
  const [language, setLanguage] = useState('');
  const [languageCode, setLanguageCode] = useState('');

  const classes = useStyles();

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

  useEffect(() => {
    getAllCountries();
  }, []);

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

  
  const getCountryByName = async (countryName: string,getText:boolean) => {
    
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
  return (
    <div>
      <div className={classes.searchContainer}>
        <TextField
          label="Search for a country"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {showSuggestions && (
          <Paper className={classes.suggestions}>
            <List>
              {filteredCountries.map((country: any) => (
                <ListItem key={country.name} onClick={() => getCountryByName(country.name,true)}>
                  <ListItemText primary={country.name} />
                </ListItem>
              ))}
              <ListItem className={classes.viewAllBtn} onClick={()=>handleViewAll(searchQuery,false)}>
                <ListItemText primary="View All" />
              </ListItem>
            </List>
          </Paper>
        )}
      </div>
      <div>
      <TextField
        label="Enter Language"
        variant="outlined"
        value={filter.language}
        onChange={(e) => setFilter({...filter,language:e.target.value})}
        margin="normal"
      />
       <TextField
        label="Enter Region"
        variant="outlined"
        value={filter.region}
        onChange={(e) => setFilter({...filter,region:e.target.value})}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleFetchData} sx={{ mt: 2 }}>
        Apply 
      </Button>
      <Button variant="contained" color="primary" onClick={() => setFilter({ language: '', region: '' })} sx={{ mt: 2 }}>
          Cancel
        </Button>
      </div>

      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            <h2>All Countries</h2>
            <div>
              { countries.length > 0 && (countries?.map((country: any) => (
                <Card sx={{ maxWidth: 345, marginBottom: 2 }} key={country.name}>
                  <Link to={`/country/${country.name}`} style={{ textDecoration: 'none' }}>
                    <CardContent>
                      <CardActions>
                        <img className={classes.flag} src={`https://flagcdn.com/${country.alpha2Code.toLowerCase()}.svg`} alt="flag" />
                        <Typography gutterBottom variant="h5" component="div">
                          {country.name}
                        </Typography>
                      </CardActions>
                      <Typography variant="body2" color="text.secondary">
                        Capital: {country.capital}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                      Region: {country.region}
                      </Typography>

                    </CardContent>
                  </Link>
                </Card>
              )))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCountries;
