export interface CardType {
    name: string, capital: string, region: string, domain: string, countryItem: any
}
export interface FavoritesType {
    favorites: string[]
}
interface Filter {
    language: string;
    region: string;
}
export interface FilterType {
    handleFetchData: (handleClose: () => void) => Promise<void>;
    filter: Filter;
    setFilter: React.Dispatch<React.SetStateAction<Filter>>;
    getAllCountries: () => Promise<void>;
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
}