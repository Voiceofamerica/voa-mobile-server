import { articles } from "./handler";

articles({}, {}, function(err, res) {
  console.log(res)
})