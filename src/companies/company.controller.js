import Company from "../companies/company.model.js"

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