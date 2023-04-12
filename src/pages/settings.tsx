import {Container} from "@mui/material";
import ContextMenu from "@/components/context-menu";

const Settings = () => {
  return (
    <Container>
      <ContextMenu
        menuItems={[{
          label: 'Settings',
          value: 'settings'
        }]} onSelect={(value) => {
        console.log(value)
      }}>
        <div
          style={{
            width: 400,
            height: 400,
            backgroundColor: 'red'
          }}>Settings
          <ContextMenu menuItems={[{
            label: 'settings1',
            value: 'settings1'
          }]} onSelect={(value) => {
            console.log(value)

          }}>
            <div style={{
              height: 200,
              backgroundColor: 'blue'
            }}>settings1
            </div>
          </ContextMenu>
        </div>
      </ContextMenu>
    </Container>
  )
}

export default Settings