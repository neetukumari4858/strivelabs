import { useEffect, useState, useCallback } from 'react';
import { Typography } from '@mui/material';
import { useGetApis } from "../customHook/useGetApis"
import { useTheme } from '@mui/material/styles';
import { Search, FilterModal, Favorites, CountryCard } from "./index";
import useMediaQuery from '@mui/material/useMediaQuery';
import useAllCountriesStyles from './useAllCountriesStyles';
import debounce from 'lodash.debounce';

const AllCountries = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const classes = useAllCountriesStyles();
  const theme = useTheme();
  const { getAllCountries, filter, setFilter, languages, regionMenu, populationRanges, setShowSuggestions, viewAll, areaRanges, countries, isLoading, error, getCountryByName, handleViewAll, handleSearchChange, filteredCountries, showSuggestions, searchQuery, handleFetchData } = useGetApis();
  const itemsPerPage = 20;
  const currentCountries = Array.isArray(countries) ? countries.slice(0, currentPage * itemsPerPage) : [];
  const totalPages = Array.isArray(countries) ? Math.ceil(countries.length / itemsPerPage) : 0;
  const matchesSmallScreen = useMediaQuery(theme?.breakpoints?.down('sm') || '(max-width:600px)');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
        !isLoading &&
        currentPage < totalPages
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }, 300),
    [isLoading, currentPage, totalPages]
  );

  useEffect(() => {
    getAllCountries();
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={classes.container}>
      <div className={classes.globeContainer}>
        <h1>Country Explorer</h1>
        <div>Explore the Knowlege by Exploring the World</div>
      </div>
      <div className={classes.contentContainer}>
        <div className={classes.headerItem}>
          <Search
            getCountryByName={getCountryByName}
            handleViewAll={handleViewAll}
            handleSearchChange={handleSearchChange}
            filteredCountries={filteredCountries}
            showSuggestions={showSuggestions}
            searchQuery={searchQuery}
            viewAll={viewAll}
            setShowSuggestions={setShowSuggestions}
          />
          <FilterModal
            handleFetchData={handleFetchData}
            filter={filter}
            setFilter={setFilter}
            getAllCountries={getAllCountries}
            regionMenu={regionMenu || []}
            populationRanges={populationRanges || []}
            areaRanges={areaRanges || []}
            languageMenu={languages || []}
          />
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
                  <Typography>{`Page ${currentPage} of ${totalPages}`}</Typography>
                </div>
                {
                  matchesSmallScreen && favorites.length > 0 && (
                    <Favorites favorites={favorites} />
                  )
                }
              </div>
              <div className={classes.content}>
                <div className={classes.listContainer}>
                  {currentCountries.length > 0 ? (
                    currentCountries.map((country: any) => (
                      <CountryCard
                        key={country.name}
                        name={country.name}
                        capital={country.capital}
                        region={country.region}
                        domain={country.topLevelDomain}
                        countryItem={country}
                        area={country.area}
                        population={country.population}
                      />
                    ))
                  ) : (
                    <Typography variant="h6">
                      No countries found. Please adjust your search or filter criteria.
                    </Typography>
                  )}
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
