"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

const items = [
  { id: "Shoes", label: "Shoes" },
  { id: "Men T-shirts", label: "Men T-shirts" },
  { id: "Makeup", label: "Makeup" },
  { id: "Jewellery", label: "Jewellery" },
  { id: "Women T-shirts", label: "Women T-shirts" },
  { id: "Furniture", label: "Furniture" },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()),
});

const Interests = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { items: [] },
  });

  useEffect(() => {
    const fetchInterests = async () => {
      const response = await axios.get("/api/get-interests");
      form.setValue("items", response.data.interests);
    };
    fetchInterests();
  }, [form]);

  const interests = form.watch("items");
  const onSubmit = async () => {
    await axios.put("/api/update-interests", { interests });
  };

  return (
    <div className="w-full h-[52rem] flex items-center">
      <div className="mx-auto border border-gray-300 py-14 px-14 rounded-2xl h-[40rem] w-[35rem]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <h1 className="text-center font-bold text-3xl mb-4">
                      Please mark your interests!
                    </h1>
                    <h5 className="text-center mb-12 text-lg font-medium">
                      We will keep you notified.
                    </h5>
                    <h4 className="font-semibold text-xl">
                      My saved interests!
                    </h4>
                  </div>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start">
                          <div className="flex space-x-3 mt-3">
                            <FormControl>
                              <Checkbox
                                type="submit"
                                className="h-6 w-6 bg-[#ccc] border-none"
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) =>
                                  checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }
                              />
                            </FormControl>
                            <FormLabel className="text-[17px] font-medium">
                              {item.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex font-semibold mt-16 text-lg text-[#acacac]">
          <ChevronLeft />
          <ChevronLeft />
          <ChevronLeft />
          <p className="mx-1">1</p>
          <p className="mx-1">2</p>
          <p className="mx-1">3</p>
          <p className="mx-1 text-black">4</p>
          <p className="mx-1">5</p>
          <p className="mx-1">6</p>
          <p className="mx-1">7 . . .</p>
          <ChevronRight />
          <ChevronRight />
          <ChevronRight />
        </div>
      </div>
    </div>
  );
};

export default Interests;
