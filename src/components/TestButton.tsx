import {ButtonBase, styled} from "@mui/material";

const TestButton = styled(ButtonBase)(({  }) => ({
  boxShadow: '0 2px 8px 0 rgba(0,0,0,.3)',
  outline: 'none',
  padding: '10px 15px',
  borderRadius: 5,
  border: 'none',
  backgroundColor: '#000',
  color: '#fff',
  cursor: 'pointer',
  width: '100%',
  fontSize: 14,
}));

export default TestButton