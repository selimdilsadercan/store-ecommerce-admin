"use client";

import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/Heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

////

const fromSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "Must be a valid hex color",
  }),
});

type ColorFormValues = z.infer<typeof fromSchema>;

////

interface ColorFormProps {
  initialData: Color | null;
}

const BillboardForm = ({ initialData }: ColorFormProps) => {
  //hooks
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const router = useRouter();

  //form
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(fromSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  //variables
  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const buttonText = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData ? "Color Updated" : "Color Created";

  //methods
  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMessage);
      ////
    } catch (error) {
      toast.error("something went wrong");
      ////
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast.success("Color deleted");
      ////
    } catch (error) {
      toast.error(
        "Make sure you removed all products that use this color first",
      );
      ////
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  ////

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            color="sm"
            onClick={() => {
              setOpen(true);
            }}
            disabled={loading}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>

                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />

                      <div
                        className="rounded-full border p-4 ring-1 ring-slate-400"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="ml-auto"
            variant="secondary"
            onClick={() => router.push(`/${params.storeId}/colors`)}>
            Cancel
          </Button>

          <Button disabled={loading} className="ml-2" type="submit">
            {buttonText}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
