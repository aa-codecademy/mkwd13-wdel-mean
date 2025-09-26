import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: [{ type: String }],
    default: [],
  })
  refreshTokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await hash(this.password, 8);

  next();
});
