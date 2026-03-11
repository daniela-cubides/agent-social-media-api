export class CreateCompanyDto {
  name: string;
  description?: string;
  colors?: { hex: string; type: string }[];
  logos?: { file: string; type?: string; key?: string }[];
  fonts?: { primary?: string; secondary?: string };
  brandVoice?: string;
  productsOrServices?: string[];
  keywords?: string[];
  websiteLinks?: string[];
}
