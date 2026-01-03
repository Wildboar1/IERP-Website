// scripts/convertPenalCodes.js
import xlsx from "xlsx";
import fs from "fs";

const workbook = xlsx.readFile("app/components/data/Penal codes .xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

let currentTitle = "";
const data = [];

rows.forEach(row => {
  if (row["SAN ANDREAS PENAL CODE"]?.startsWith("TITLE")) {
    currentTitle = row["SAN ANDREAS PENAL CODE"];
  } else if (row["Unnamed: 4"]) {
    data.push({
      title: currentTitle,
      name: row["SAN ANDREAS PENAL CODE"],
      classification: row["Unnamed: 1"],
      sentence: row["Unnamed: 2"],
      fine: row["Unnamed: 3"],
      description: row["Unnamed: 4"]
    });
  }
});

fs.writeFileSync(
  "data/penal-codes.json",
  JSON.stringify(data, null, 2)
);
