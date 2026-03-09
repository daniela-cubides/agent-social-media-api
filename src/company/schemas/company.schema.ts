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

@Schema()
export class Company {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ type: [BrandColorSchema], required: false, default: [] })
    colors?: BrandColor[];

    @Prop({ type: [String], required: false, default: [] })
    logos?: string[];

    @Prop({ type: [String], required: false, default: [] })
    fonts?: string[];

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
