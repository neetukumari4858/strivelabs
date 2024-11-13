import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useGetApis } from '../src/customHook/useGetApis';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AllCountries from './components/AllCountries';
import FilterModal from "./components/Filter";
import Search from "./components/Search";
import '@testing-library/jest-dom';

const theme = createTheme();

jest.mock('../src/customHook/useGetApis'); // Mock custom hook

// Explicitly cast the mocked `useGetApis` to a jest.Mock type
const mockedUseGetApis = useGetApis as jest.Mock;
const mockProps = {
  getCountryByName: jest.fn(),
  handleViewAll: jest.fn(),
  handleSearchChange: jest.fn(),
  filteredCountries: [],
  showSuggestions: false,
  searchQuery: '',
  viewAll: false,
  setShowSuggestions: jest.fn(),
};
describe('AllCountries Component', () => {
  beforeEach(() => {
    // Set up the mock to return initial values
    mockedUseGetApis.mockReturnValue({
      getAllCountries: jest.fn(),
      filter: { language: '', region: '', population: '', area: '' },
      setFilter: jest.fn(),
      currentPage: 1,
      totalPages: 2,
      regionMenu: ['Africa', 'Asia'],
      countries: [
        { name: 'India', capital: 'Delhi', region: 'Asia', area: 3287263, population: 1393409038 },
        { name: 'Canada', capital: 'Ottawa', region: 'Americas', area: 9984670, population: 37742154 }
      ],
      isLoading: false,
      error: null,
      handleFetchData: jest.fn(),
      setSearchQuery: jest.fn(),
      handleViewAll: jest.fn(),
      handleSearchChange: jest.fn(),
      filteredCountries: [],
      showSuggestions: false,
      searchQuery: '',
    });
    jest.clearAllMocks();

  });

  it('should render the AllCountries component', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Router>
          <AllCountries />
        </Router>
      </ThemeProvider>
    );
    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug();
    expect(screen.getByText('Country Explorer')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Explore the Knowlege by Exploring the World/i)).toBeInTheDocument();
    });
  });

  it('should render the countries list', () => {
    render(
      <ThemeProvider theme={theme}>
        <Router>
          <AllCountries />
        </Router>
      </ThemeProvider>
    );
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  it('should display loading message when data is being fetched', () => {
    mockedUseGetApis.mockReturnValue({
      getAllCountries: jest.fn(),
      filter: { language: '', region: '', population: '', area: '' },
      setFilter: jest.fn(),
      regionMenu: ['Africa', 'Asia'],
      populationRanges: ['1M-10M', '10M-50M'],
      areaRanges: ['Small', 'Large'],
      countries: [],
      filteredCountries: [],
      isLoading: true,
      error: null,
      handleSearchChange: jest.fn(),
      handleViewAll: jest.fn(),
      showSuggestions: false,
      searchQuery: '',
      handleFetchData: jest.fn(),
    });

    render(
      <ThemeProvider theme={theme}>
        <Router>
          <AllCountries />
        </Router>
      </ThemeProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();

  });


  // Filter Modal

  it('should render the FilterModal and open it when button is clicked', () => {
    render(<FilterModal handleFetchData={jest.fn()} filter={{ language: '', region: '', population: '', area: '' }} setFilter={jest.fn()} getAllCountries={jest.fn()} regionMenu={['Asia']} populationRanges={['1M-10M']} areaRanges={['Small']} countries={undefined} />);
    // Check if the filter button is rendered
    const filterButton = screen.getByText('Country Filter');
    fireEvent.click(filterButton);
    // Check if modal opens after button click
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should close the modal when CloseIcon is clicked', () => {
    render(<FilterModal handleFetchData={jest.fn()} filter={{ language: '', region: '', population: '', area: '' }} setFilter={jest.fn()} getAllCountries={jest.fn()} regionMenu={['Asia']} populationRanges={['1M-10M']} areaRanges={['Small']} countries={undefined} />);
    fireEvent.click(screen.getByText('Country Filter'));
    fireEvent.click(screen.getByTestId('close-icon'));
    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  it('should call handleFetchData when Apply button is clicked', () => {
    const handleFetchDataMock = jest.fn();
    render(<FilterModal handleFetchData={handleFetchDataMock} filter={{ language: '', region: '', population: '', area: '' }} setFilter={jest.fn()} getAllCountries={jest.fn()} regionMenu={['Asia']} populationRanges={['1M-10M']} areaRanges={['Small']} countries={undefined} />);
    fireEvent.click(screen.getByText('Country Filter'));
    fireEvent.click(screen.getByText('Apply'));
    expect(handleFetchDataMock).toHaveBeenCalled();
  });

  it('should clear filters when Clear button is clicked', () => {
    const setFilterMock = jest.fn();
    render(<FilterModal handleFetchData={jest.fn()} filter={{ language: '', region: '', population: '', area: '' }} setFilter={setFilterMock} getAllCountries={jest.fn()} regionMenu={['Asia']} populationRanges={['1M-10M']} areaRanges={['Small']} countries={undefined} />);
    fireEvent.click(screen.getByText('Country Filter'));
    fireEvent.click(screen.getByText('Clear'));
    expect(setFilterMock).toHaveBeenCalledWith({
      language: '',
      region: '',
      population: '',
      area: ''
    });
  });

  it('should render the search input field', () => {
    render(
      <ThemeProvider theme={theme}>
        <Search {...mockProps} />
      </ThemeProvider>
    ); const searchInput = screen.getByLabelText(/search for a country/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should display search suggestions based on the input', async () => {
    const updatedProps = {
      ...mockProps,
      filteredCountries: [
        { name: 'India' },
        { name: 'Indonesia' },
        { name: 'Iceland' },
      ],
      showSuggestions: true,
      searchQuery: 'Ind',
    };
    render(
      <ThemeProvider theme={theme}>
        <Search {...updatedProps} />
      </ThemeProvider>
    );
    const suggestions = await screen.findAllByRole('listitem');
    expect(suggestions).toHaveLength(3);
    expect(screen.getByText(/india/i)).toBeInTheDocument();
    expect(screen.getByText(/indonesia/i)).toBeInTheDocument();
    expect(screen.getByText(/iceland/i)).toBeInTheDocument();
  });

  it('should display "Country Not Found" when no results match', () => {
    const updatedProps = {
      ...mockProps,
      filteredCountries: [],
      showSuggestions: true,
      searchQuery: 'XYZ',
    };
    render(
      <ThemeProvider theme={theme}>
        <Search {...updatedProps} />
      </ThemeProvider>
    ); const notFoundText = screen.getByText(/country not found/i);
    expect(notFoundText).toBeInTheDocument();
  });

  it('should call "getCountryByName" when a suggestion is clicked', async () => {
    const updatedProps = {
      ...mockProps,
      filteredCountries: [{ name: 'India' }],
      showSuggestions: true,
      searchQuery: 'Ind',
    };
    render(
      <ThemeProvider theme={theme}>
        <Search {...updatedProps} />
      </ThemeProvider>
    ); const suggestionItem = screen.getByText(/india/i);
    fireEvent.click(suggestionItem);
    await waitFor(() => {
      expect(mockProps.getCountryByName).toHaveBeenCalledWith('India', true);
    });
  });

  it('should display "View All" button when there are more than 5 suggestions', () => {
    const updatedProps = {
      ...mockProps,
      filteredCountries: [
        { name: 'India' },
        { name: 'Indonesia' },
        { name: 'Iceland' },
        { name: 'Ireland' },
        { name: 'Italy' },
        { name: 'Iran' },
      ],
      showSuggestions: true,
      viewAll: true,
      searchQuery: 'I',
    };
    render(
      <ThemeProvider theme={theme}>
        <Search {...updatedProps} />
      </ThemeProvider>
    ); const viewAllButton = screen.getByText(/view all/i);
    expect(viewAllButton).toBeInTheDocument();
  });

  it('should call "handleViewAll" when "View All" button is clicked', () => {
    const updatedProps = {
      ...mockProps,
      filteredCountries: [
        { name: 'India' },
        { name: 'Indonesia' },
        { name: 'Iceland' },
      ],
      showSuggestions: true,
      viewAll: true,
      searchQuery: 'Ind',
    };
    render(
      <ThemeProvider theme={theme}>
        <Search {...updatedProps} />
      </ThemeProvider>
    ); const viewAllButton = screen.getByText(/view all/i);
    fireEvent.click(viewAllButton);
    expect(mockProps.handleViewAll).toHaveBeenCalledWith('Ind', false);
  });
});

