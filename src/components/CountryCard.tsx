import {  Card, CardActions, CardContent,  Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, } from "react-router-dom";
import useAllCountriesStyles from './useAllCountriesStyles';

const CountryCard=(props:any)=> {
const {name,capital,region,domain,countryItem}=props;
    const classes = useAllCountriesStyles();
    const theme = useTheme();
  return (
    <Card sx={(theme) => ({
        width: 250,
        height: 200,
        [theme.breakpoints.up('md')]: {
          width: 345,
          height: 300,
        },
        marginBottom: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })} key={name}>
        <Link to={`/country/${name}`} style={{ textDecoration: 'none' }}>
          <CardContent className={classes.cardInfo}>
            <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <img className={classes.flag} src={`https://flagcdn.com/${countryItem.alpha2Code.toLowerCase()}.svg`} alt="flag" />
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
            </CardActions>
            <div className={classes.cardContent}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.3rem' } }}>
                Capital: {capital}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.3rem' } }}>
                Region: {region}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1.3rem' } }}>
                Domain: {domain}
              </Typography>
            </div>
          </CardContent>
        </Link>
      </Card>
  )
}

export default CountryCard
