import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProxyTaskContext } from "@/context/ProxyTaskContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import z from "zod"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const schema = z.object({
  sku: z.string(),
})

export default function InterparkQueueTaskDialog(props: Props) {
  const { open, onOpenChange } = props
  const { t } = useTranslation()
  const form = useForm({
    defaultValues: {
      sku: "24003932",
    },
    resolver: zodResolver(schema),
  })

  const { startTaskWithMode } = useContext(ProxyTaskContext)

  const onSubmit = form.handleSubmit(async (values: z.infer<typeof schema>) => {
    await startTaskWithMode?.("test_interpark_global_queue", values)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="home.task.interparkQueue.configDialog.title">
              Interpark Global Queue Task Config
            </Trans>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(data) => {
              void onSubmit(data).then()
            }}
          >
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormControl>
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey="home.task.interparkQueue.configDialog.sku">
                        SKU
                      </Trans>
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder={t(
                        "home.task.interparkQueue.configDialog.sku",
                        {
                          defaultValue: "SKU",
                        },
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                </FormControl>
              )}
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  onOpenChange(false)
                }}
              >
                <Trans i18nKey="home.task.interparkQueue.configDialog.cancel">
                  Cancel
                </Trans>
              </Button>
              <Button type="submit">
                <Trans i18nKey="home.task.interparkQueue.configDialog.confirm">
                  Confirm
                </Trans>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
