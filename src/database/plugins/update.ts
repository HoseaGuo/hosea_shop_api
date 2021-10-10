import {Schema} from 'mongoose'

export default function updatePlugin(schema: Schema, options: any){
  let now = new Date();
  // 中间件，保存的时候，设置创建时间、更新时间
  schema.pre('save', function() {
    this.set({ createdAt: now });
    this.set({ updatedAt: now });
  });
  // 中间件，更新的时候，修改更新时间
  schema.pre('updateOne', function() {
    this.set({ updatedAt: now });
  });
}