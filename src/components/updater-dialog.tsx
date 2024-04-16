import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { UpdateInfo } from "@/hooks/use-update"
import { listen } from "@tauri-apps/api/event"
import { relaunch } from "@tauri-apps/api/process"
import { installUpdate } from "@tauri-apps/api/updater"
import { Download, LoaderCircle, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

export const Updater = ({
  update,
}: {
  update: UpdateInfo
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    ;(async () => {
      await listen("show_update_modal", () => {
        setDialogOpen(true)
      })
    })()
  }, [])

  const handleRelaunch = async () => {
    await relaunch()
  }

  console.log(update)
  if (update.isAvailable && update.status === "DONE") {
    return (
      <Badge
        className="flex gap-2 bg-slate-600 rounded-full"
        onClick={handleRelaunch}
      >
        <RefreshCcw size={12} />
        <Trans i18nKey="update.relaunch">Relaunch</Trans>
      </Badge>
    )
  }
  if (update.isAvailable && update.status !== null) {
    return (
      <Badge className="flex gap-2 bg-slate-600 rounded-full">
        <LoaderCircle size={12} className="animate-spin" />
        <p>Updating...</p>
      </Badge>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger>
            <Badge className="bg-gradient-to-br from-slate-600 to-slate-800 shadow-none rounded-full hover:from-slate-600 hover:to-slate-500">
              <div className="text-xs font-light cursor-pointer flex gap-2 items-center justify-center">
                <Download size={12} />
                {t("update.tooltip", {
                  defaultValue: "New Version",
                })}
              </div>
            </Badge>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <Trans
            i18nKey="update.tooltip.content"
            values={{
              version: update?.manifest?.version,
            }}
          >
            Update Available! Click here to update
          </Trans>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <form
          onSubmit={async (_event) => {
            _event.preventDefault()
            console.log("installing update")
            try {
              await installUpdate()
              console.log("update installed")
            } catch (e) {
              console.error(e)
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="mb-4">
              <Trans i18nKey="update.dialog.title">Update Available</Trans>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="mb-4">
            <Trans
              i18nKey="update.dialog.description"
              values={{
                version: update?.manifest?.version,
              }}
            >
              An update to Proxy Tester is available. do you want to update now?
            </Trans>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">
                <Trans i18nKey="update.dialog.cancel">Cancel</Trans>
              </Button>
            </DialogClose>
            <Button type="submit">
              <Trans i18nKey="update.dialog.confirm">Update</Trans>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
