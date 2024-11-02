import { useEffect, useState, useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import { useGetApis } from "../customHook/useGetApis"
import { useTheme } from '@mui/material/styles';
import { Search, FilterModal, Favorites, CountryCard } from "./index";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import useMediaQuery from '@mui/material/useMediaQuery';
import useAllCountriesStyles from './useAllCountriesStyles';

const AllCountries = () => {
  const { getAllCountries, filter, setFilter, countries = [], isLoading, error } = useGetApis();
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useAllCountriesStyles();
  const theme = useTheme();

  const itemsPerPage = 20;
  const currentCountries = Array.isArray(countries) ? countries.slice(0, currentPage * itemsPerPage) : [];
  const totalPages = Array.isArray(countries) ? Math.ceil(countries.length / itemsPerPage) : 0;
  const matchesSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [isLoading]);


  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filter.language) params.set("language", filter.language);
    if (filter.region) params.set("region", filter.region);
    params.set("page", String(currentPage));
    navigate({ search: params.toString() }, { replace: true });
  }, [filter, currentPage, navigate]);


  useEffect(() => {
    getAllCountries();
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lang = params.get("language");
    const region = params.get("region");
    const page = params.get("page");

    if (lang || region) {
      setFilter({
        language: lang || "",
        region: region || ""
      });
    }
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [location.search, setFilter]);

  useEffect(() => {
    updateUrlParams();
  }, [filter, currentPage, updateUrlParams]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={classes.container}>
      <div className={classes.globeContainer}>
        <h1>Country Explorer</h1>
        <div>Explore the Knowlege by Exploring the World </div>
      </div>
      <div className={classes.contentContainer}>
        <div className={classes.headerItem}>
          <Search />
          <FilterModal />
        </div>
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div>
              <div className={classes.header}>
                <h2>All Countries</h2>
                <div className={classes.pagination}>
                  <Button
                    sx={{
                      height: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    }}
                    onClick={handlePreviousPage}
                    variant="outlined"
                    disabled={currentPage === 1}
                    startIcon={<ArrowBackIosIcon />}
                  >
                    Prev
                  </Button>
                  <Typography>{`Page ${currentPage} of ${totalPages}`}</Typography>
                  <Button
                    sx={{
                      height: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    }}
                    onClick={handleNextPage}
                    variant="outlined"
                    disabled={currentPage === totalPages}
                    endIcon={<ArrowForwardIosIcon />}
                  >
                    Next
                  </Button>
                </div>
                {
                  matchesSmallScreen && favorites.length > 0 && (
                    <Favorites favorites={favorites} />
                  )
                }
              </div>
              <div className={classes.content}>
                <div className={classes.listContainer}>
                  {currentCountries.length > 0 && (currentCountries?.map((country: any) => (
                    <CountryCard name={country.name} capital={country.capital} region={country.region} domain={country.topLevelDomain} countryItem={country} />

                  )))}
                </div>
                {
                  !matchesSmallScreen && favorites.length > 0 && (
                    <Favorites favorites={favorites} />
                  )
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCountries;
