const bcrypt = require('bcryptjs');
const hash = "$2b$10$5av1.O1UQO9hmyDU7sYtt.53YMjDkGbUg7IlmbBrCrBPYM/KqJLZ6";
console.log(bcrypt.compareSync('campus122', hash)); // Should print true