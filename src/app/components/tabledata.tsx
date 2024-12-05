"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

// Define Product interface
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function ProductsTable() {
    const [productsData, setProductsData] = useState<Product[]>([]);
    const url = "http://127.0.0.1:8000/api/products";

    useEffect(() => {
        fetchData(url);
    }, []);

    const fetchData = (fetchUrl: string) => {
        axios
            .get<{ products: Product[] }>(fetchUrl)
            .then((response) => {
                setProductsData(response.data.products);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    };

    const handleDelete = (productId: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            axios.delete(`http://127.0.0.1:8000/api/productdelete/${productId}`)
                .then(() => {
                    fetchData(url);
                })
                .catch((error) => {
                    console.error("Error deleting product:", error);
                });
        }
    };

    return (
        <table className="table table-zebra w-full">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th className="py-3 px-6">#</th>
                    <th className="py-3 px-6">Photo</th>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {productsData.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-100">
                        <td className="py-2 px-6">{product.id}</td>
                        <td className="py-2 px-6">
                            <Image 
                                width={100} 
                                height={100} 
                                src={`http://127.0.0.1:8000/storage/${product.image}`} 
                                alt={product.name} 
                                className="object-cover"
                            />
                        </td>
                        <td className="py-2 px-6">{product.name}</td>
                        <td className="py-2 px-6">${product.price.toFixed(2)}</td>
                        <td className="py-2 px-6 text-center">
                            <div className="flex justify-center space-x-2">
                                <Link 
                                    href={`/products/view/${product.id}`} 
                                    className="btn btn-info btn-sm"
                                >
                                    View
                                </Link>
                                <Link 
                                    href={`/products/edit/${product.id}`} 
                                    className="btn btn-warning btn-sm"
                                >
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="btn btn-error btn-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}