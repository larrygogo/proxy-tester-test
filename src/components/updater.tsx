import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { UpdateInfo } from "@/hooks/use-update"
import { relaunch } from "@tauri-apps/api/process"
import { installUpdate } from "@tauri-apps/api/updater"
import { Download, LoaderCircle, RefreshCcw } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { Trans } from "react-i18next"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

export const Updater = ({
  update,
}: {
  update: UpdateInfo
}) => {
  const [error, setError] = useState<string>("")
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    console.log("update status", update)
    if (update.status === "ERROR") {
      setError(update.error)
      setErrorDialogOpen(true)
    }
  }, [update])

  const handleRelaunch = async () => {
    await relaunch()
  }

  return (
    <div>
      {update.status === "DONE" && (
        <Badge
          className="flex gap-1 bg-gradient-to-br from-slate-600 to-slate-800 shadow-none rounded-full hover:from-slate-600 hover:to-slate-500"
          onClick={handleRelaunch}
        >
          <RefreshCcw size={12} strokeWidth={3} />
          <Trans i18nKey="update.relaunch">Relaunch</Trans>
        </Badge>
      )}
      {(update.status === "PENDING" || update.status === "DOWNLOADED") && (
        <Badge className="flex gap-1 bg-gradient-to-br from-slate-600 to-slate-800 shadow-none rounded-full hover:from-slate-600 hover:to-slate-500">
          <LoaderCircle size={12} strokeWidth={3} className="animate-spin" />
          <Trans i18nKey="update.downloading">Downloading</Trans>
        </Badge>
      )}
      {update.isAvailable && update.status === null && (
        <Tooltip>
          <TooltipTrigger onClick={() => setDialogOpen(true)}>
            <Badge className="flex gap-1 bg-gradient-to-br from-slate-600 to-slate-800 shadow-none rounded-full hover:from-slate-600 hover:to-slate-500">
              <Download size={12} strokeWidth={3} />
              <Trans i18nKey="update.tooltip">New Version</Trans>
            </Badge>
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
      )}
      <UpdaterDialog
        update={update}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <ErrorDialog
        error={error}
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
      />
    </div>
  )
}

function UpdaterDialog(props: {
  update: UpdateInfo
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { update, open, onOpenChange } = props

  const handleSubmit = async (_event: React.FormEvent) => {
    _event.preventDefault()
    console.log("installing update")
    onOpenChange(false)
    await installUpdate()
    console.log("update installed")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
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

function ErrorDialog(props: {
  error: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { error, open, onOpenChange } = props

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="update.error">Update Error</Trans>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{error}</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">
              <Trans i18nKey="update.error.dialog.close">Close</Trans>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
