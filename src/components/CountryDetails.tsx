import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card, Container, CardContent } from "@mui/material";
import { useGetApis } from "../customHook/useGetApis";
import { makeStyles } from "@mui/styles";
import { Theme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import worldmapImg from "../assets/detailImage.png";
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const useStyles = makeStyles((theme: Theme) => ({
  detailContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '5rem',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'center',
      margin: '2rem',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  worldmapImage: {
    maxWidth: '100%',
    height: 'auto',
    marginTop: '2rem',
  },
}));

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
  }, [countryName,getCountryByName]);

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
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            {countries?.map((countryInfo: any) => (
              <Card>
                <CardContent>
                  <Container key={countryInfo.name} className={classes.content}>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Country: {countryInfo.name}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }} >
                      Capital:  {countryInfo.capital}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }} >
                      Region : {countryInfo.region}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }} >
                      Domain : {countryInfo.topLevelDomain}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }} >
                      Favorites : {<Fab size="small" aria-label="like" onClick={() => toggleFavorite(countryName)}>
                        {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </Fab>}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }} >
                      If you Like while Exploring this Country then Hit the Favorite Button...
                    </Typography>
                  </Container>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
      <div>
        <img src={worldmapImg} alt="worldmapimg" className={classes.worldmapImage} />
      </div>
    </Container>
  );
};

export default CountryDetails;