import {Box, Container, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useSettings} from "@/hooks/useSettings";

const Settings = () => {
  const {settings, saveSettings} = useSettings()
  return (
    <Container>
      <Box sx={{mt: 10}}>
        <FormControl>
          <InputLabel htmlFor="my-input">Concurrency</InputLabel>
          <Select
            defaultValue={1}
            value={settings.concurrency}
            onChange={(e) => {
              console.log(typeof e.target.value)
              saveSettings({concurrency: e.target.value as number})
          }}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Container>
  )
}

export default Settings