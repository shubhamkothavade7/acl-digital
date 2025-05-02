'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { ProductFilters } from '@/components/dashboard/products/product-filters';
import { ProductsGrid } from '@/components/dashboard/products/product-table';
import { ProductFormDialog, ProductFormValues } from './ProductFormDialog';
import { useState, useEffect } from "react";


// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

// const productslist = [
//   {
//     id: 'PRD-010',
//     name: 'Organic Green Tea',
//     image: '/assets/product-10.png',
//     price: 12.99,
//     description: 'Premium organic green tea sourced from Japan.',
//     category: 'Beverages',
//     stock: 50,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-009',
//     name: 'Almond Butter',
//     image: '/assets/product-9.png',
//     price: 8.5,
//     description: 'Smooth and creamy almond butter with no additives.',
//     category: 'Spreads',
//     stock: 120,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-008',
//     name: 'Quinoa (1kg)',
//     image: '/assets/product-8.png',
//     price: 5.25,
//     description: 'High-protein white quinoa, perfect for salads and meals.',
//     category: 'Grains',
//     stock: 200,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-007',
//     name: 'Avocado Oil',
//     image: '/assets/product-7.png',
//     price: 10.75,
//     description: 'Cold-pressed avocado oil rich in healthy fats.',
//     category: 'Oils & Vinegars',
//     stock: 35,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-006',
//     name: 'Whole Grain Bread',
//     image: '/assets/product-6.png',
//     price: 3.99,
//     description: 'Freshly baked whole grain bread with flax seeds.',
//     category: 'Bakery',
//     stock: 80,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-005',
//     name: 'Greek Yogurt (Plain)',
//     image: '/assets/product-5.png',
//     price: 1.49,
//     description: 'Creamy plain Greek yogurt, great source of protein.',
//     category: 'Dairy',
//     stock: 150,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-004',
//     name: 'Chia Seeds',
//     image: '/assets/product-4.png',
//     price: 6.5,
//     description: 'Nutrient-rich chia seeds for smoothies and baking.',
//     category: 'Health Foods',
//     stock: 95,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-003',
//     name: 'Brown Basmati Rice (2kg)',
//     image: '/assets/product-3.png',
//     price: 7.25,
//     description: 'Aromatic brown basmati rice for healthy cooking.',
//     category: 'Grains',
//     stock: 70,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-002',
//     name: 'Coconut Milk (400ml)',
//     image: '/assets/product-2.png',
//     price: 2.29,
//     description: 'Rich and creamy coconut milk perfect for curries.',
//     category: 'Canned Goods',
//     stock: 180,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'PRD-001',
//     name: 'Dark Chocolate (85%)',
//     image: '/assets/product-1.png',
//     price: 3.45,
//     description: 'Bittersweet dark chocolate with 85% cocoa content.',
//     category: 'Snacks & Sweets',
//     stock: 60,
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
// ] satisfies Product[];

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  createdAt: Date;
}

const initialProducts: Product[] = [
  {
    id: 'PRD-001',
    name: 'Dark Chocolate (85%)',
    image: '/assets/product-1.png',
    price: 3.45,
    description: 'Bittersweet dark chocolate with 85% cocoa content.',
    category: 'Snacks & Sweets',
    stock: 60,
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  // Add other products here if needed...
];

export default function Page(): React.JSX.Element {
  const productslist = [];
  const page = 0;
  const rowsPerPage = 10;
  const [products, setProducts] = React.useState<Product[]>(productslist);

  const paginatedCustomers = applyPagination(products, page, rowsPerPage);
  const [openForm, setOpenForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormMode('add');
    setOpenForm(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const fetchProductsAPI = async () => {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "GET", // GET request to fetch products
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error("Error fetching products");
    }
    return response.json(); // Parse the JSON response
  };

  const fetchProducts = async () => {
    try {
      const res = await fetchProductsAPI();
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const handleSubmitForm = (data: ProductFormValues) => {
    if (formMode === 'add') {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name: data.title,
        description: data.description,
        price: Number(data.price),
        image: data.image,
        category: 'Uncategorized',
        stock: 0,
        createdAt: new Date(),
      };
      setProducts((prev) => [newProduct, ...prev]);
    } else if (formMode === 'edit' && selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        name: data.title,
        description: data.description,
        price: Number(data.price),
        image: data.image,
      };
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Products List</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={handleOpenAdd}
            variant="contained"
          >
            Add
          </Button>

        </div>
      </Stack>
      <ProductFilters />
      <ProductsGrid
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onEdit={handleOpenEdit}
      />

      <ProductFormDialog
        open={openForm}
        mode={formMode}
        initialData={
          selectedProduct
            ? {
              title: selectedProduct.name,
              description: selectedProduct.description,
              price: String(selectedProduct.price),
              image: selectedProduct.image,
            }
            : undefined
        }
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

    </Stack>
  );
}

function applyPagination(rows: Product[], page: number, rowsPerPage: number): Product[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
