import {InputBase, styled} from "@mui/material";

const TargetInput = styled(InputBase)(({ theme }) => ({
  boxShadow: '0 2px 8px 0 rgba(0,0,0,.1)',
  borderRadius: 20,
  padding: '10px 20px',
  transaction: theme.transitions.create(['box-shadow'], {
    easing: theme.transitions.easing.easeInOut,
  }),
  '&:hover, &:focus': {
    boxShadow: '0 2px 8px 0 rgba(0,0,0,.2)',
  },
  '& input': {
    border: 'none',
    outline: 'none',
    fontSize: 16,
    padding: 0,
    margin: 0,
  }
}));

export default TargetInput