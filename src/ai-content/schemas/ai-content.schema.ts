import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Company } from "../../company/schemas/company.schema";
export type AiContentDocument = HydratedDocument<AiContent>;

export enum AiContentStatus {
    Draft = "draft",
    Approved = "approved",
    Published = "published",
}

@Schema({ timestamps: true })
export class AiContent {
    @Prop({ required: true })
    caption: string;

    @Prop({ required: false })
    imageS3Url?: string;

    @Prop({ required: false })
    imageS3Key?: string;

    @Prop({ required: false })
    prompt?: string;

    @Prop({ required: false })
    createdAt?: Date;

    @Prop({ required: false })
    updatedAt?: Date;

    @Prop({ required: false })
    approvedAt?: Date;

    @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
    companyId: Types.ObjectId;

    @Prop({ type: String, enum: AiContentStatus, required: true })
    status: AiContentStatus;
}

export const AiContentSchema = SchemaFactory.createForClass(AiContent);
