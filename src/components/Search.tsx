import { TextField, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useGetApis } from "../customHook/useGetApis"
import useAllCountriesStyles from './useAllCountriesStyles';

const Search = () => {
    const { handleSearchChange, getCountryByName, handleViewAll, filteredCountries, searchQuery, showSuggestions } = useGetApis();
    const classes = useAllCountriesStyles();

    return (
        <div className={classes.searchContainer}>
            <TextField
                label="Search for a country..."
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                    '.MuiOutlinedInput-root': {
                        height: '2.8rem',
                    },
                }}
            />
            {showSuggestions && (
                <Paper className={classes.suggestions}>
                    <List>
                        {filteredCountries.map((country: any) => (
                            <ListItem key={country.name} onClick={() => getCountryByName(country.name, true)} sx={{ cursor: "pointer" }}>
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
    )
}

export default Search
