import {InputBase, styled} from "@mui/material";

const TargetInput = styled(InputBase)(({theme}) => ({
  boxShadow: 'none',
  padding: '10px 20px',
  borderRadius: theme.spacing(3),
  transaction: theme.transitions.create(['box-shadow'], {
    easing: theme.transitions.easing.easeInOut,
  }),
  color: '#97a8ba',
  background: theme.palette.background.default,
  fontFamily: 'Nunito, Roboto, Helvetica, Arial, sans-serif',
  fontWeight: 800,
  // 背景模糊
  border: '1px solid rgba(255,255,255,.2)',
  // '&:hover, &:focus-within': {
  //   borderColor: 'transparent'
  // },
  transitions: 'background-color .4s ease-in-out, color .4s ease-in-out',
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