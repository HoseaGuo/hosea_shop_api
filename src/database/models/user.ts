import mongoose, { Schema, model, Model, Types } from 'mongoose';

const MODEL_NAME = "user";

interface DocType {
  /* 用户名 */
  username: string;
  /* 密码 */
  password: string;
  /* 密码盐 */
  salt: string;
  /* 角色 */
  roles: Types.ObjectId[];
}


// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<DocType>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  salt: { // 密码加密用到的盐
    type: String,
    required: true,
    trim: true,
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'role' }]
}, { timestamps: {} });

const userModel = model(MODEL_NAME, schema);

// Makes the indexes in MongoDB match the indexes defined in this model's schema.
userModel.syncIndexes();

export default userModel;

