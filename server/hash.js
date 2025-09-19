// hash.js
import bcrypt from "bcrypt";

const rounds = 12;
const newPassword = "abc@1234!";

bcrypt.hash(newPassword, rounds, (err, hash) => {
  if (err) throw err;
  console.log(hash); // save this to DB
});
