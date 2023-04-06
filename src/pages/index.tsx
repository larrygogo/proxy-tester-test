import {Box, Container} from "@mui/material";
import TargetInput from "@/components/TargetInput";

export default function Home() {

  return (
    <Box>
      <Container>
        <h1>Proxy Tester</h1>
        <TargetInput fullWidth placeholder="www.google.com"/>
      </Container>

    </Box>
  )
}
