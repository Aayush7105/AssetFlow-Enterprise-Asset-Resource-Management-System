const db = require("../config/db");

const createCategory = async (req, res) => {
    try {

        const {
            name,
            description,
            extra_fields_schema
        } = req.body;

        const category = await db.query(
            `
            SELECT id
            FROM asset_categories
            WHERE LOWER(name)=LOWER($1)
            `,
            [name]
        );

        if(category.rows.length>0){
            return res.status(409).json({
                success:false,
                message:"Category already exists."
            });
        }

        const result = await db.query(
            `
            INSERT INTO asset_categories
            (
                name,
                description,
                extra_fields_schema
            )
            VALUES
            (
                $1,$2,$3
            )
            RETURNING *
            `,
            [
                name,
                description,
                extra_fields_schema || {}
            ]
        );

        res.status(201).json({
            success:true,
            message:"Category created successfully.",
            data:result.rows[0]
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }
};


const getAllCategories = async(req,res)=>{

    try{

        const result = await db.query(
            `
            SELECT *
            FROM asset_categories
            ORDER BY created_at DESC
            `
        );

        res.status(200).json({
            success:true,
            data:result.rows
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

};


const getCategoryById = async(req,res)=>{

    try{

        const {id}=req.params;

        const result = await db.query(
            `
            SELECT *
            FROM asset_categories
            WHERE id=$1
            `,
            [id]
        );

        if(result.rows.length===0){
            return res.status(404).json({
                success:false,
                message:"Category not found."
            });
        }

        res.status(200).json({
            success:true,
            data:result.rows[0]
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

};


const updateCategory = async(req,res)=>{

    try{

        const {id}=req.params;

        const {
            name,
            description,
            extra_fields_schema,
            status
        } = req.body;

        const result = await db.query(
            `
            UPDATE asset_categories
            SET

            name=$1,
            description=$2,
            extra_fields_schema=$3,
            status=$4,
            updated_at=CURRENT_TIMESTAMP

            WHERE id=$5

            RETURNING *

            `,
            [
                name,
                description,
                extra_fields_schema || {},
                status,
                id
            ]
        );

        if(result.rows.length===0){
            return res.status(404).json({
                success:false,
                message:"Category not found."
            });
        }

        res.status(200).json({
            success:true,
            message:"Category updated successfully.",
            data:result.rows[0]
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

};

const deleteCategory = async(req,res)=>{

    try{

        const {id}=req.params;

        const result = await db.query(
            `
            UPDATE asset_categories
            SET

            status='INACTIVE',
            updated_at=CURRENT_TIMESTAMP

            WHERE id=$1

            RETURNING *
            `,
            [id]
        );

        if(result.rows.length===0){
            return res.status(404).json({
                success:false,
                message:"Category not found."
            });
        }

        res.status(200).json({
            success:true,
            message:"Category deactivated successfully."
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

};

module.exports={
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};