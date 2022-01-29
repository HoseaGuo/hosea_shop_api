import mongoose, { Schema, model, Model, Types } from 'mongoose';

const MODEL_NAME = "role";

interface DocType {
  /* 名称 */
  name: string;
  /* 菜单 */
  menus: Types.ObjectId[];
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<DocType>({
  name: { type: String, required: true, unique: true, trim: true },
  menus: [{ type: Schema.Types.ObjectId, ref: 'menu' }]
}, { timestamps: {} });

const userModel = model(MODEL_NAME, schema);

// Makes the indexes in MongoDB match the indexes defined in this model's schema.
userModel.syncIndexes();

export default userModel;

