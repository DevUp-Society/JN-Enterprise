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

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row: ProductCSVRow) => {
        products.push({
          name: row.Name,
          description: row.Description,
          price: parseFloat(row.Price),
          stockQuantity: parseInt(row.Stock, 10),
          category: row.Category,
          sku: `SKU-BULK-${Math.floor(100000 + Math.random() * 900000)}`,
          image: row.ImageURL || null,
          version: 0
        });
      })
      .on("end", async () => {
        try {
          const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
          
          if (!adminUser) throw new Error('NO_ADMIN_FOUND_FOR_BULK_ATTRIBUTION');

          // 3. Map products to include creatorId
          const finalProducts = products.map((p) => ({
            ...p,
            creatorId: adminUser.id,
          }));

          // 4. Bulk Insert
          const result = await prisma.product.createMany({
            data: finalProducts,
            skipDuplicates: true,
          });

          // Clean up file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          resolve(result);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (err) => reject(err));
  });
};
