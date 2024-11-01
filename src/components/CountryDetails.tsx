import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import { useGetApis } from "../utils/useGetApis";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { makeStyles } from "@mui/styles";
import globeImg from "../assets/globe.jpg";
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const useStyles = makeStyles({

  detailContainer: {
    display: 'flex',
    justifyContent: "space-between",
    margin: '5rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  content: {
    display: 'flex',
    flexDirection: "column",
    gap: '1rem'
  },
})
const CountryDetails = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const classes = useStyles()
  const { countryName } = useParams();
  const navigate = useNavigate()
  const { getCountryByName, countries, isLoading, error } = useGetApis()

  const toggleFavorite = (countryName: any) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(countryName)) {
      updatedFavorites = updatedFavorites.filter((name) => name !== countryName);
    } else if (favorites.length < 5) {
      updatedFavorites.push(countryName);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  const isFavorite = favorites.includes(countryName);

  useEffect(() => {
    getCountryByName(countryName, true)
  }, [countryName]);

  const backTohome = () => {
    navigate('/')
  }
  return (
    <Container className={classes.detailContainer}>
      <div>
        <div className={classes.header}>
          <Fab size="small" color="primary" aria-label="add">

            <ArrowBackIcon onClick={backTohome} />
          </Fab>
          <h1>{countryName}</h1>
          <Fab size="small" aria-label="like" onClick={() => toggleFavorite(countryName)}>
                  {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </Fab>
        </div>
        {isLoading ? (
          <p>Loading...</p> 
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            {countries?.map((countryInfo: any) => (
              <div key={countryInfo.name} className={classes.content}>
                <Typography variant="h6">
                  Country:{countryInfo.name}
                </Typography>

                <Typography variant="h6" >
                  Capital: {countryInfo.capital}
                </Typography>
                <Typography variant="h6" >
                  Region :{countryInfo.region}
                </Typography>
                <Typography variant="h6" >
                  Domain :{countryInfo.topLevelDomain}
                </Typography>
                

                <Typography variant="h6" >
                  If you Like while Exploring this Country then Hit the Like Button...
                </Typography>
                
                
              </div>
            ))}
          </>
        )}
      </div>

      <div>
        <img src={globeImg} alt="globeImg" />
      </div>
    </Container>
  );
};

export default CountryDetails;