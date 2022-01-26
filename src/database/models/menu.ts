import mongoose, { Schema, model, Model, Types } from 'mongoose';

const MODEL_NAME = "menu";

interface DocType {
  /* 目录名 */
  name: string;
  /* 路径 */
  path: string;
  /* 序号 */
  index: number;
  /* 父级目录id */
  parentId: string
}


// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<DocType>({
  name: { type: String, required: true, trim: true },
  path: { type: String, required: true, trim: true },
  index: { type: Number, default: 0 },
  parentId: { type: String, default: "0" } // "0" 表示一级目录
}, { timestamps: {} });

const menuModel = model(MODEL_NAME, schema);

// Makes the indexes in MongoDB match the indexes defined in this model's schema.
menuModel.syncIndexes();

export default menuModel;

