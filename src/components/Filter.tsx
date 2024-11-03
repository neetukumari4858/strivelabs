import { Button, TextField, Typography, Box, Modal } from '@mui/material';
import { useState } from 'react';
import { FilterType } from "../types/counteriesTypes";
import CloseIcon from '@mui/icons-material/Close';

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
  const { handleFetchData, filter, setFilter, getAllCountries } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const clearFilterHandler = () => {
    setFilter({ language: '', region: '' })
    getAllCountries()
  }
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
            <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
          </Box>
          <TextField
            label="Enter Language"
            variant="outlined"
            value={filter.language}
            onChange={(e) => setFilter({ ...filter, language: e.target.value })}
            margin="normal"
            fullWidth
            sx={{
              '.MuiOutlinedInput-root': {
                height: '3rem',
              },
            }}
          />
          <TextField
            label="Enter Region"
            variant="outlined"
            value={filter.region}
            onChange={(e) => setFilter({ ...filter, region: e.target.value })}
            margin="normal"
            fullWidth
            sx={{
              '.MuiOutlinedInput-root': {
                height: '3rem',
              },
            }}
          />
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
