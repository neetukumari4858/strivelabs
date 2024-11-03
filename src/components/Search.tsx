import { TextField, List, ListItem, ListItemText, Paper } from '@mui/material';
import useAllCountriesStyles from './useAllCountriesStyles';
import {SearchProps} from "../types/counteriesTypes"

const Search: React.FC<SearchProps> = (props) => {
    const { getCountryByName, handleViewAll, handleSearchChange, filteredCountries, showSuggestions, searchQuery } = props
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
                        {
                            filteredCountries.length > 0 ? (filteredCountries.map((country: any) => (
                                <ListItem key={country.name} onClick={() => getCountryByName(country.name, true)} sx={{ cursor: "pointer" }}>
                                    <ListItemText primary={country.name} />
                                </ListItem>
                            ))) : (<ListItem>
                                <ListItemText primary="Country Not Found " />
                            </ListItem>)
                        }
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
