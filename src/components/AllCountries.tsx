import { useEffect, useState } from 'react';
import { Box, Card, CardActions, CardContent, TextField, Typography, List, ListItem, ListItemText, Paper, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import { useGetApis } from "../utils/useGetApis"
import globeImg from "../assets/globe.jpg";
import FilterModal from "./Filter"
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

  globeContainer: {
    backgroundImage: `url(${globeImg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    padding: '2rem'

  },
  headerItem: {
    display: 'flex',
    alignItems: 'flex-end',
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  content:{
    display:'flex',
  },
  listContainer:{
    display:'flex',
    flexWrap:'wrap',
    gap:'2rem',
  }
});

const AllCountries = () => {
  const classes = useStyles();

  const { getAllCountries, handleSearchChange, getCountryByName, handleViewAll, countries, filteredCountries, searchQuery, isLoading, error, showSuggestions } = useGetApis()

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getAllCountries();
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.globeContainer}>
        <h1>Country Explorer</h1>
        <div>Explore the Knowlege by Exploring the World </div>
      </div>
      <div className={classes.contentContainer}>
        <div className={classes.headerItem}>
          <div className={classes.searchContainer}>
            <TextField
              label="Search for a country"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                '.MuiOutlinedInput-root': {
                  height: '3rem',
                  width: '25rem'
                },
              }}
            />
            {showSuggestions && (
              <Paper className={classes.suggestions}>
                <List>
                  {filteredCountries.map((country: any) => (
                    <ListItem key={country.name} onClick={() => getCountryByName(country.name, true)}>
                      <ListItemText primary={country.name} />
                    </ListItem>
                  ))}
                  <ListItem className={classes.viewAllBtn} onClick={() => handleViewAll(searchQuery, false)}>
                    <ListItemText primary="View All" />
                  </ListItem>
                </List>
              </Paper>
            )}
          </div>
          <FilterModal />
        </div>
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div>
              <h2>All Countries</h2>
              <div className={classes.content}>
              <div className={classes.listContainer}>
                {countries.length > 0 && (countries?.map((country: any) => (
                  <Card sx={{
                    width: 310,   
                    marginBottom: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }} key={country.name}>
                    <Link to={`/country/${country.name}`} style={{ textDecoration: 'none' }}>
                      <CardContent>
                        <CardActions>
                          <img className={classes.flag} src={`https://flagcdn.com/${country.alpha2Code.toLowerCase()}.svg`} alt="flag" />
                          <Typography gutterBottom variant="h5" component="div">
                            {country.name}
                          </Typography>
                        </CardActions>
                        <Container>
                        <Typography variant="body2" color="text.secondary" >
                          Capital: {country.capital}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Region: {country.region}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Domain: {country.topLevelDomain}
                        </Typography>
                        </Container>

                      </CardContent>
                    </Link>
                  </Card>
                )))}
              </div>
              <div>
                {favorites.length > 0 && (
                  <Box
                    width="200px"
                    bgcolor="#f7f9fd"
                    padding={2}
                    height="100vh"
                  >
                    <Typography variant="h6">Favorite Countries {favorites.length}</Typography>
                    <List>
                      {favorites.map((countryName) => (
                        <ListItem key={countryName}>
                          <Typography>{countryName}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCountries;
