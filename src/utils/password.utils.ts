import bcrypt from 'bcrypt';
export async function hashPassword(password:any) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  };