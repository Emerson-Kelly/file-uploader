//import { pool } from "../db/pool.js";

export const indexGet = async (req, res) => {

    res.render("pages/index", {
      title: "Home",
    });
  
};
