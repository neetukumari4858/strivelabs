
import { Button, TextField,Typography } from '@mui/material';
import { useGetApis } from "../utils/useGetApis"
import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display:'flex',
  flexDirection:'column'
};
const FilterModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { handleFetchData, filter, setFilter } = useGetApis()
  return (
    <div>
      <Button variant="contained" sx={{ mt: 1 }} color="primary" onClick={handleOpen}>Country Filter</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

      
      <Typography color="black">
      Filters
                      </Typography>
      <CloseIcon onClick={handleClose}/>
          </Box>
          <TextField
            label="Enter Language"
            variant="outlined"
            value={filter.language}
            onChange={(e) => setFilter({ ...filter, language: e.target.value })}
            margin="normal"
            sx={{
              '.MuiOutlinedInput-root': {
                height: '3rem',
                width:'25rem' 
              },
            }}
          />
          <TextField
            label="Enter Region"
            variant="outlined"
            value={filter.region}
            onChange={(e) => setFilter({ ...filter, region: e.target.value })}
            margin="normal"
            sx={{
              '.MuiOutlinedInput-root': {
                height: '3rem',
                width:'25rem' 
              },
            }}
          />
          <Box sx={{display:"flex",gap:'1rem'}}>

          <Button variant="contained" color="primary" onClick={handleFetchData} sx={{ mt: 2 }}>
            Apply
          </Button>
          <Button variant="contained" color="primary" onClick={() => setFilter({ language: '', region: '' })} sx={{ mt: 2 }}>
            Cancel
          </Button>
          </Box>
        </Box>
      </Modal>
    </div>

  )
}

export default FilterModal;
