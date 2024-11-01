import { Route, Routes } from "react-router-dom"
import { AllCountries,CountryDetails } from "../components"

const  AppRoutes=()=> {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AllCountries/>}/>
        <Route path="/country/:countryName" element={<CountryDetails/>}/>
      </Routes>
    </div>
  )
}

export default AppRoutes
