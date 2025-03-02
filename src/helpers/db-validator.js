import Company from "../companies/company.model.js";

export const existCompanyAlready = async (name = "") => {
    const company = await Company.findOne({ name });

    if (company) {
        throw new Error(`The company '${name}' already exists in the database.`);
    }
};

export const existCompanyById = async (id = "") => {
    const company = await Company.findById(id);

    if (!company) {
        throw new Error(`No company found with ID: ${id}`);
    }
};