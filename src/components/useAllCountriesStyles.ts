import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import globeImg from "../assets/globe.jpg";

const useAllCountriesStyles = makeStyles((theme: Theme) => ({
    flag: {
      borderRadius: '100%',
      height: 35,
      width: 40,
      [theme.breakpoints.up('md')]: {
        height: 45,
        width: 50,
      },
      backgroundColor: "black"
    },
    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1rem',
      width: '100%',
      maxWidth: 360,
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
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      flexDirection: 'column',
      padding: '1rem',
      [theme.breakpoints.up('md')]: {
        height: 400,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    contentContainer: {
      padding: '1rem',
      [theme.breakpoints.up('sm')]: {
        padding: '2rem',
      },
    },
    headerItem: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
  
    },
    content: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      [theme.breakpoints.up('md')]: {
        justifyContent: 'space-between',
      },
      margin: '2rem',
  
    },
    listContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
      [theme.breakpoints.up('md')]: {
        gap: '2rem',
      },
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      justifyContent: 'center',
      marginTop: '1rem',
    },
    cardContent: {
      display: 'flex',
      gap: '0.5rem',
      flexDirection: 'column',
      padding: '0.7rem',
    },
    cardInfo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
  
    },
  }));
  
export default useAllCountriesStyles;
