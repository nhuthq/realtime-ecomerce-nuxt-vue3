/** @type {import("prettier").Config} */
module.exports = {
  semi: false, // Bỏ dấu ;
  singleQuote: true, // Dùng dấu nháy đơn
  tabWidth: 2, // 2 spaces
  trailingComma: "es5", // Có dấu phẩy cuối với object/array
  bracketSpacing: true, // Có khoảng trắng trong {} → { foo: bar }
  arrowParens: "avoid", // arrow function không có () nếu 1 tham số
  endOfLine: "auto", // Tự điều chỉnh theo OS
};
