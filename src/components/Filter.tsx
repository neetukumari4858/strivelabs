import { Button, Typography, Box, Modal } from '@mui/material';
import { useState } from 'react';
import { FilterType } from "../types/counteriesTypes";
import { useGetApis } from '../customHook/useGetApis'
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const languageMapping: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "Germany",
  pt: "Brazil",
  zh: "Chine",
  ja: "Japan"
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, md: 4 },
  display: 'flex',
  flexDirection: 'column',
};

const FilterModal = (props: FilterType) => {
  const { handleFetchData, filter, setFilter, getAllCountries, regionMenu, populationRanges,
    areaRanges } = props;
  const { setSearchQuery } = useGetApis()
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const clearFilterHandler = () => {
    const resetFilter = { language: '', region: '', population: '', area: '' };
    setFilter(resetFilter);
    getAllCountries();
    setSearchQuery('')

  };

  const handleFilterChange = (name: string, value: string) => {
    const updatedFilter = { ...filter, [name]: value };
    setFilter(updatedFilter);
  };

  return (
    <div>
      <Button variant="contained" sx={(theme) => ({
        mt: 0,
        [theme.breakpoints.up('md')]: {
          mt: 1
        }
      })} color="primary" onClick={handleOpen}>Country Filter</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography color="black" variant="h6">
              Filters
            </Typography>
            <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} data-testid="close-icon"
            />
          </Box>
          {/* Language Select */}
          <FormControl fullWidth margin="normal">
            <Select
              value={filter.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: 'auto'
                  }
                }
              }}
            >
              <MenuItem value="" style={{ color: 'gray' }}>Language</MenuItem>
              {Object.entries(languageMapping).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Region Select */}
          <FormControl fullWidth margin="normal">
            <Select
              value={filter.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: 'auto'
                  }
                }
              }}
            >
              <MenuItem value="" style={{ color: 'gray' }}>Region</MenuItem>
              {regionMenu
                .map((region: any) => region)
                .filter((region: string, index: number, self: string[]) => self.indexOf(region) === index) // Remove duplicates
                .map((region: string, index: number) => (
                  <MenuItem key={index} value={region}>
                    {region}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* Population Select */}
          <FormControl fullWidth margin="normal">
            <Select
              value={filter.population}
              onChange={(e) => handleFilterChange('population', e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: 'auto'
                  }
                }
              }}
            >
              <MenuItem value="">Population</MenuItem>
              {(populationRanges ?? [])
                .map((population: any) => population)
                .filter((population: string, index: number, self: string[]) => self.indexOf(population) === index) // Remove duplicates
                .map((population: string, index: number) => (
                  <MenuItem key={index} value={population}>
                    {population}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* Area Select */}
          <FormControl fullWidth margin="normal">
            <Select
              value={filter.area}
              onChange={(e) => handleFilterChange('area', e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: 'auto'
                  }
                }
              }}
            >
              <MenuItem value="" style={{ color: 'gray' }}>Area</MenuItem>
              {areaRanges
                .map((area: any) => area)
                .filter((area: string, index: number, self: string[]) => self.indexOf(area) === index) // Remove duplicates
                .map((area: string, index: number) => (
                  <MenuItem key={index} value={area}>
                    {area}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: '1rem', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleFetchData(handleClose)} sx={{ mt: 2 }}>
              Apply
            </Button>
            <Button variant="contained" color="primary" onClick={clearFilterHandler} sx={{ mt: 2 }}>
              Clear
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default FilterModal;