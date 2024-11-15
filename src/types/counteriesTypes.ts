export interface CardType {
    name: string, capital: string, region: string, domain: string, countryItem: any, area: string, population: string
}
export interface FavoritesType {
    favorites: string[]
}
interface Filter {
    language: string;
    region: string;
    population: string,
    area: string
}
export interface FilterType {
    handleFetchData: any;
    filter: Filter;
    setFilter: React.Dispatch<React.SetStateAction<Filter>>;
    getAllCountries: () => Promise<void>;
    regionMenu: string[];
    populationRanges: string[];
    areaRanges: string[];
    languageMenu:string[];
}
interface Country {
    name: string;
}
export interface SearchProps {
    getCountryByName: (countryName: string, getText: boolean) => Promise<void>;
    handleViewAll: (searchQuery: string, getText: boolean) => void;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filteredCountries: Country[];
    showSuggestions: boolean;
    searchQuery: string;
    viewAll: boolean;
    setShowSuggestions: any;
}