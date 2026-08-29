"use client";

import * as React from "react";
import BreadCrumbs, { BreadcrumbItem } from "./BreadCrumbs";
import InfoProduct from "./InfoProduct";
import PurchaseProduct from "./PurchaseProduct";
// import MightLike from "@/app/components/mightLike/MightLike";
import { ProductItem } from "@/app/interfaces/products.interfaces";

interface ProductContainerProps {
  product: ProductItem;
}

export default function ProductContainer({ product }: ProductContainerProps) {
  const breadcrumbData: BreadcrumbItem[] = [{ label: "TRANG CHỦ", href: "/" }];

  if (product.categories && product.categories.length > 0) {
    product.categories.forEach((cat) => {
      breadcrumbData.push({
        label: cat.name.toUpperCase(),
        href: `/collections/${cat.slug}`,
      });
    });
  }

  breadcrumbData.push({
    label: product.name.toUpperCase(),
    href: "#",
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-6 text-neutral-900">
      <div className="container mx-auto">
        <BreadCrumbs items={breadcrumbData} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <InfoProduct product={product} />
          <PurchaseProduct product={product} />
        </div>

        {/* <MightLike /> */}
      </div>
    </div>
  );
}
