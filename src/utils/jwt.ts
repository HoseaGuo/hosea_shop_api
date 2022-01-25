import jwt, { JwtPayload } from "jsonwebtoken"

const SECRET = 'hosea.shop';

// 生成token
export function sign(data: any) {
  return jwt.sign({
    data
  }, SECRET, { expiresIn: '1d' });
}

// 验证token
export function verify(token: string): JwtPayload {
  return (jwt.verify(token, SECRET) as JwtPayload);
}