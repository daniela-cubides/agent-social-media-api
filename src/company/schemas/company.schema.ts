import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ _id: false })
export class BrandColor {
    @Prop({ required: true })
    hex: string;

    @Prop({ required: true })
    type: string;
}

export const BrandColorSchema = SchemaFactory.createForClass(BrandColor);

@Schema({ _id: false })
export class CompanyFonts {
    @Prop({ required: false })
    primary?: string;

    @Prop({ required: false })
    secondary?: string;
}

export const CompanyFontsSchema = SchemaFactory.createForClass(CompanyFonts);

@Schema({ _id: false })
export class Logo {
    @Prop({ required: true })
    file: string;

    @Prop({ required: false })
    type?: string;

    @Prop({ required: false })
    key?: string;
}

export const LogoSchema = SchemaFactory.createForClass(Logo);

@Schema()
export class Company {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ type: [BrandColorSchema], required: false, default: [] })
    colors?: BrandColor[];

    @Prop({ type: [LogoSchema], required: false, default: [] })
    logos?: Logo[];

    @Prop({ type: CompanyFontsSchema, required: false })
    fonts?: CompanyFonts;

    @Prop({ required: false })
    brandVoice?: string;

    @Prop({ type: [String], required: false, default: [] })
    productsOrServices?: string[];

    @Prop({ type: [String], required: false, default: [] })
    keywords?: string[];

    @Prop({ type: [String], required: false, default: [] })
    websiteLinks?: string[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
