import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { ProxyTaskContext } from "@/context/ProxyTaskContext"
import { proxyListAtom } from "@/lib/jotai"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { nanoid } from "nanoid"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Trans } from "react-i18next"
import { z } from "zod"

const proxyStringEditSchema = z.object({
  proxyListString: z.string(),
})

interface ProxyEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProxyEditDialog(props: ProxyEditDialogProps) {
  const { open, onOpenChange } = props
  const [proxyList, setProxyList] = useAtom(proxyListAtom)
  const { setProxyStates } = useContext(ProxyTaskContext)

  const form = useForm({
    defaultValues: {
      proxyListString: "",
    },
    resolver: zodResolver(proxyStringEditSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    const proxyList = data.proxyListString
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
    setProxyList(proxyList)
    setProxyStates?.(
      proxyList.map((proxy) => {
        const [host, port, username, password] = proxy.split(":")
        return {
          id: nanoid(),
          host,
          port: Number(port),
          username,
          password,
          value: proxy,
        }
      }),
    )
    onOpenChange(false)
  })

  useEffect(() => {
    form.setValue("proxyListString", proxyList.join("\n"))
  }, [form, proxyList])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="home.editProxyDialog.title">Edit Proxy List</Trans>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <FormField
              name="proxyListString"
              render={({ field }) => (
                <FormItem>
                  <textarea
                    {...field}
                    className="h-32 w-full resize-none rounded-lg border p-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-background"
                    placeholder="host:port[:username:password]"
                  />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">
                  <Trans i18nKey="home.editProxyDialog.cancel">Cancel</Trans>
                </Button>
              </DialogClose>
              <Button type="submit">
                <Trans i18nKey="home.editProxyDialog.confirm">Save</Trans>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
