import fs from "node:fs";
import { getAssets } from "@/alpaca/assets/getAssets";

const syncToJson = async () => {
  const assets = await getAssets();

  const assetsCount = assets.length;
  console.log("Total assets count:", assetsCount);

  fs.writeFileSync("assets.json", JSON.stringify(assets, null, 2), "utf-8");
};

await syncToJson();
