import { Schema, model, Model } from 'mongoose';

interface DocType {
  title: string;
  content: string;
}

class Article {
  myMethod() { return 42; } // document上的方法  TInstanceMethods 
  static myStatic() { return 42; } // model上使用的方法
  get myVirtual() { return 42; } // document上的计算属性  doc.myVirtual 就会调用这个方法 schema.virtual('myVirtual').get(() => {}).set(() => {})
}


// interface Model<T, TQueryHelpers = {}, TMethods = {}, TVirtuals = {}> extends NodeJS.EventEmitter

// 当查找的时候，可以用到的
interface TQueryHelpers {

}

interface TMethods {
  myMethod(): number;
}

interface TVirtuals {
  myVirtual(): number;
}

interface IModel extends Model<DocType, TQueryHelpers, TMethods, TVirtuals> {
  myStatic(): number;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<DocType, IModel>({
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: {} });

schema.loadClass(Article);

let Tank = model('Tank', schema);

Tank.myStatic

let tank = new Tank();

tank.title = "";

console.log(tank);
// console.log(tank.myVirtual)
// console.log(tank.myMethod());

export default schema;

