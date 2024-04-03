"use client"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {useContext} from "react";
import {ProxyTaskContext} from "@/context/ProxyTaskContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = z.object({
  sku: z.string()
})

export default function InterparkQueueTaskDialog(props: Props){
  const {open, onOpenChange} = props;
  const form = useForm({
    defaultValues: {
      sku: ''
    },
    resolver: zodResolver(schema)
  });

  const {startTaskWithMode} = useContext(ProxyTaskContext)

  const onSubmit = form.handleSubmit(async (values: z.infer<typeof schema>) => {
    await startTaskWithMode?.('test_interpark_global_queue', values)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>填写必要参数</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              name="sku"
              render={({field}) => (
                <FormItem>
                  <Input {...field} placeholder="SKU" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>取消</Button>
              <Button type="submit">提交</Button>
            </div>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  )
}