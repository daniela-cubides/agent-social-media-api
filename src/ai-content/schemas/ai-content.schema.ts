import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AiContentDocument = HydratedDocument<AiContent>;

export enum AiContentStatus {
    Scheduled = "scheduled",
    Published = "published",
}

@Schema()
export class AiContent {
    @Prop({ required: true })
    caption: string;

    @Prop({ required: false })
    imageBase64?: string;

    @Prop({ required: false })
    imageMimeType?: string;

    @Prop({ type: String, enum: AiContentStatus, required: true })
    status: AiContentStatus;
}

export const AiContentSchema = SchemaFactory.createForClass(AiContent);