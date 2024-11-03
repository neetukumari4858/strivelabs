import { Box, Typography, List, ListItem } from '@mui/material';
import { FavoritesType } from "../types/counteriesTypes";

const Favorites = (props: FavoritesType) => {
    const { favorites } = props;
    return (
        <div>
            {favorites.length > 0 && (
                <Box
                    width="200px"
                    bgcolor="#f7f9fd"
                    padding={2}
                    mt={3}
                >
                    <Typography variant="h6">Favorite Countries {favorites.length}</Typography>
                    <List>
                        {favorites.map((countryName: string) => (
                            <ListItem key={countryName}>
                                <Typography>{countryName}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </div>
    )
}

export default Favorites
