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
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Trans} from "react-i18next";

const proxyStringEditSchema = z.object({
  proxyListString: z.string(),
})

interface ProxyEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: string
  onFinish?: (value: string) => boolean
}

export default function ProxyEditDialog(props: ProxyEditDialogProps) {
  const { open, onOpenChange, onFinish } = props

  const form = useForm({
    defaultValues: {
      proxyListString: props.value,
    },
    resolver: zodResolver(proxyStringEditSchema),
  })

  useEffect(() => {
    form.reset({ proxyListString: props.value })
  }, [form, props.value])

  const onSubmit = form.handleSubmit((values) => {
    const close = onFinish?.(values.proxyListString ?? "")
    if (close) {
      onOpenChange(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="home.editProxyDialog.title">
              Edit Proxy List
            </Trans>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={(data) => {
              void onSubmit(data).then()
            }}
          >
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
                  <Trans i18nKey="home.editProxyDialog.cancel">
                    Cancel
                  </Trans>
                </Button>
              </DialogClose>
              <Button type="submit">
                <Trans i18nKey="home.editProxyDialog.confirm">
                  Save
                </Trans>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
