// Icon
import { Search } from "lucide-react";
import { Field } from "@/components/ui/field";

// Shad
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchHeader() {
  return (
    <div>
      <Field className="w-[20vw]">
        <InputGroup className="group rounded-2xl border-2 border-[#DDDDDD] transition-all duration-200 focus-within:border-(--primaryCus) focus-within:ring-4 focus-within:ring-(--primaryCus)/20 hover:border-(--primaryCus)/50">
          <InputGroupInput
            id="input-group-url"
            placeholder="Tìm kiếm sản phẩm,..."
            className="border-none focus-visible:ring-0 focus-visible:outline-none"
          />
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer rounded-full bg-(--primaryCus) p-2 text-white transition-all duration-200 hover:bg-(--primaryCus)/85 active:scale-90"
          >
            <Search className="" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
