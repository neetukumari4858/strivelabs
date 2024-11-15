import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { Link, } from "react-router-dom";
import { CardType } from '../types/counteriesTypes';
import useAllCountriesStyles from './useAllCountriesStyles';

const CountryCard = (props: CardType) => {
    const { name, capital, region, domain, countryItem, area, population } = props;
    const classes = useAllCountriesStyles();
    return (
        <Card sx={(theme) => ({
            width: 250,

            [theme.breakpoints.up('md')]: {
                width: 250,
            },
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        })} key={name}>
            <Link to={`/country/${name}`}
                state={countryItem}
                style={{ textDecoration: 'none' }}>
                <CardContent className={classes.cardInfo}>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <img className={classes.flag} src={`https://flagcdn.com/${countryItem.alpha2Code?.toLowerCase() || 'default'}.svg`} alt="flag" />
                        <Typography gutterBottom variant="h5" component="div">
                            {name}
                        </Typography>
                    </CardActions>
                    <div className={classes.cardContent}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                            Capital: { capital ? capital : 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                            Region: {region ? region : 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                            Domain: {domain ? domain : 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                            Population: {population ? population : 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                            Area: {area ? area : 'N/A'}
                        </Typography>
                    </div>
                </CardContent>
            </Link>
        </Card>
    )
}

export default CountryCard
