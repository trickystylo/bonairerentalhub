import { useLanguage } from "../context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FLAGS: Record<string, string> = {
  NL: "🇳🇱",
  EN: "🇬🇧",
  PAP: "🇨🇼",
  ES: "🇪🇸"
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 w-12">
          {FLAGS[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => setLanguage("NL")}>
          🇳🇱 Nederlands
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("EN")}>
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("PAP")}>
          🇨🇼 Papiamento
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ES")}>
          🇪🇸 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};