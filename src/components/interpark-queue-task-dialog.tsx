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
          <DialogTitle>填写必要参数</DialogTitle>
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
                    <FormLabel>SKU</FormLabel>
                    <Input {...field} placeholder="SKU" />
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
                取消
              </Button>
              <Button type="submit">提交</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
