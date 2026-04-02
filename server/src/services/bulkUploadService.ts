import fs from "fs";
import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProductCSVRow {
  Name: string;
  Description: string;
  Price: string;
  Stock: string;
  Category: string;
  ImageURL: string;
}

export const processBulkProductUpload = async (filePath: string) => {
  const products: any[] = [];
  const categoryNames = new Set<string>();

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row: ProductCSVRow) => {
        products.push({
          name: row.Name,
          description: row.Description,
          price: parseFloat(row.Price),
          stock: parseInt(row.Stock, 10),
          categoryName: row.Category,
          images: row.ImageURL ? [row.ImageURL] : [],
        });
        categoryNames.add(row.Category);
      })
      .on("end", async () => {
        try {
          // 1. Ensure all categories exist
          const categories = await Promise.all(
            Array.from(categoryNames).map((name) =>
              prisma.category.upsert({
                where: { name },
                update: {},
                create: { name },
              })
            )
          );

          // 2. Create a name -> id map
          const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

          // 3. Map products to their category IDs
          const finalProducts = products.map((p) => ({
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            categoryId: categoryMap.get(p.categoryName)!,
            images: p.images,
          }));

          // 4. Bulk Insert
          const result = await prisma.product.createMany({
            data: finalProducts,
            skipDuplicates: true,
          });

          // Clean up file
          fs.unlinkSync(filePath);

          resolve(result);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (err) => reject(err));
  });
};
