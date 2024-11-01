import { makeStyles } from '@mui/styles';
import AppRoutes from './Routes/AppRoutes';
import globeImg from "../assets/globe.jpg"
import { Container } from '@mui/material';
// const useStyles= makeStyles({
//   globeContainer: {
//     backgroundImage: `url(${globeImg})`,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
// }
// })
function App() {

  // const classes = useStyles();

  return (
   

       <div>
       <AppRoutes/>
      </div>
   
  );
}

export default App;
