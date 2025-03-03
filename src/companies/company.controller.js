import fs from "fs";
import path from "path";
import exceljs from "exceljs";
import open from "open"; 
import { fileURLToPath } from "url";
import { dirname } from "path";
import Company from "../companies/company.model.js"; 

export const newCompany = async (req, res) => {
    try {
        const { name, impact, trayectory, category } = req.body;

        const company = await Company.create({
            name,
            impact,
            trayectory,
            category
        });

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to add a new company",
            error: error.message
        });
    }
};

export const listCompanies = async (req, res) => {
    try {
      let { category, trayectory, sort } = req.query;
      let query = {};
      
      if (category) query.category = category;
      if (trayectory) query.trayectory = { $gte: Number(trayectory) };
      
      let sortOption = {};
      if (sort === "A-Z") sortOption.name = 1;
      else if (sort === "Z-A") sortOption.name = -1;
  
      const companies = await Company.find(query).sort(sortOption);
        res.status(200).json({
            success: true,
            message: "Showing results for: List companies",
            Companies: companies,
        });
    } catch (error) {
      res.status(500).json({ 
        message: "Error al obtener las empresas", error: error.message
     });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, impact, trayectory, category } = req.body;
        
        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            { name, impact, trayectory, category },
            {
                new: true
            }
        )

        if (!updatedCompany) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            message: "Company udpated succesfully",
            Company: updatedCompany
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Ups, something went wrong trying to udpate the company",
            erorr: error.message
        })
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateAndOpenCompaniesReport = async (req, res) => {
    try {
        const companies = await Company.find();

        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No companies were found",
            });
        }

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Companies Report");

        worksheet.columns = [
            { header: "ID", key: "_id", width: 30 },
            { header: "Name", key: "name", width: 30 },
            { header: "Impact Level", key: "impact", width: 15 },
            { header: "Trajectory Years", key: "trayectory", width: 20 },
            { header: "Category", key: "category", width: 20 },
            { header: "Registration Date", key: "createdAt", width: 25 },
        ];

        companies.forEach((company) => {
            worksheet.addRow(company.toObject());
        });

        const reportsDir = path.join(__dirname, "../reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true }); 
        }

        const fileName = `Companies_Report_${Date.now()}.xlsx`;
        const filePath = path.join(reportsDir, fileName);

        await workbook.xlsx.writeFile(filePath);

        await open(filePath);

        res.status(200).json({
            success: true,
            message: "Report generated successfully and opened in Excel",
            filePath: filePath
        });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to generate the report",
            error: error.message,
        });
    }
};