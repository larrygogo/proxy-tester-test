import {InputBase, styled} from "@mui/material";

const TargetInput = styled(InputBase)(({theme}) => ({
  boxShadow: 'none',
  padding: '10px 20px',
  borderRadius: 4,
  transaction: theme.transitions.create(['box-shadow'], {
    easing: theme.transitions.easing.easeInOut,
  }),
  color: '#fff',
  fontFamily: 'Nunito, Roboto, Helvetica, Arial, sans-serif',
  fontWeight: 300,
  // 背景模糊
  background: 'rgba(255,255,255,.2)',
  backdropFilter: 'blur(10px)',
  '&:hover, &:focus-within': {
    boxShadow: '0 2px 8px 0 rgba(0,0,0,.2)',
  },
  '& input': {
    border: 'none',
    outline: 'none',
    fontStyle: 'normal',
    fontSize: 16,
    padding: 0,
    margin: 0,
  }
}));

export default TargetInput