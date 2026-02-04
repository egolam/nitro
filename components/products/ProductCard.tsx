import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { ProductWithMeta } from "@/data/products/getProducts";
import Link from "next/link";
import { AddOrderButton } from "./AddOrderButton";
import { ProgressBar } from "./ProgressBar";
import { Mars, Venus, VenusAndMars } from "lucide-react";

type ProductCardProps = {
  product: ProductWithMeta;
  userId?: string;
  canAddOrder?: boolean;
};

export function ProductCard({
  product,
  userId,
  canAddOrder = true,
}: ProductCardProps) {
  return (
    <Card className="h-96 rounded overflow-hidden bg-background shadow-lg text-foreground">
      <div className="w-full relative h-1/2 bg-input">
        <div className="absolute right-2 top-2 ">
          {product.tags.map((tag) => (
            <Badge
              variant={tag.name as any}
              key={tag.id}
              className="px-2 py-1 rounded-xs uppercase leading-none shadow"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <CardHeader className="gap-2 p-0">
          <CardTitle className="text-sm font-semibold capitalize flex items-center justify-between ">
            <Link
              href={`/esanslar/${product.gender === "male" ? "erkek" : product.gender === "female" ? "kadın" : "unisex"}/${product.slug}`}
              className="hover:text-violet-700 transition-colors w-48"
            >
              <h3 className="truncate">{product.factoryName}</h3>
            </Link>

            <Badge
              className="rounded-xs uppercase leading-none text-muted h-6 px-2 [&>svg]:size-4"
              variant={product.gender}
            >
              {product.gender === "male" ? (
                <Mars />
              ) : product.gender === "female" ? (
                <Venus />
              ) : (
                <VenusAndMars />
              )}
              {product.gender === "male"
                ? "Erkek"
                : product.gender === "female"
                  ? "Kadın"
                  : "Unisex"}
            </Badge>
          </CardTitle>
          <CardDescription className="flex flex-col m-0 w-62">
            <span className="text-xs text-muted-foreground">Benzer Ürün:</span>
            <h4 className="leading-none text-sm font-medium truncate">
              {product.brand + " " + product.perfume}
            </h4>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="flex flex-col gap-2">
            <p className="text-end leading-none font-medium">
              {product.price?.minBuyPrice
                ? product.price.minBuyPrice.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })
                : "Fiyat Sorunuz"}{" "}
              <span className="text-muted-foreground text-xs">
                /{product.minBuyGrams}gr
              </span>
            </p>
            <ProgressBar
              current={product.totalDemand}
              total={Math.max(
                product.minBuyThreshold,
                Math.ceil(product.totalDemand / product.minBuyThreshold) *
                  product.minBuyThreshold,
              )}
              threshold={product.minBuyThreshold}
            />
          </div>
        </CardContent>
        <CardFooter className="gap-2 p-0 mt-2">
          <AddOrderButton
            productId={product.id}
            minBuyGrams={product.minBuyGrams}
            disabled={!canAddOrder}
          />
          {userId ? (
            <FavoriteButton
              productId={product.id}
              isFavorite={product.isFavorite}
            />
          ) : null}
        </CardFooter>
      </div>
    </Card>
  );
}
