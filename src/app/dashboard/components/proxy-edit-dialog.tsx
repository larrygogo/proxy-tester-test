import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem} from "@/components/ui/form";


const proxyStringEditSchema = z.object({
  proxyListString: z.string()
});

interface ProxyEditDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proxyList?: string[];
  onFinish?: (res: T) => Promise<boolean>;
}


export default function ProxyEditDialog(props: ProxyEditDialogProps<z.infer<typeof proxyStringEditSchema>>) {
  const {open, onOpenChange, onFinish} = props;

  const form = useForm({
    defaultValues: {
      proxyListString: "",
    },
    resolver: zodResolver(proxyStringEditSchema),
  })

  const onSubmit = (data: z.infer<typeof proxyStringEditSchema>) => {
    console.log(data);
    const close = onFinish?.(data);
    if (close) {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑代理</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="proxyListString" render={({field}) => (
              <FormItem>
                <textarea
                  {...field}
                  className="w-full border h-32 p-2 rounded-lg focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-background"
                  placeholder="host:port[:username:password]"
                />
              </FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">
                  取消
                </Button>
              </DialogClose>
              <Button type="submit">
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}