import { useLanguage } from "../context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          {language}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("NL")}>
          Nederlands
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("EN")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("PAP")}>
          Papiamento
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ES")}>
          Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};