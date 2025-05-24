/**
 * @param length - độ dài của mã PIN
 * @description Hàm này tạo ra một mã PIN ngẫu nhiên với độ dài được chỉ định. Mã PIN sẽ chỉ chứa các chữ số từ 0 đến 9.
 * @returns 
 */
export function generatePin(length = 6) {
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10); // chọn số từ 0 đến 9
  }
  return pin;
}
