import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/helper/formatPrice";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { ProductWithMeta } from "@/data/products/getProducts";
import Link from "next/link";

type ProductCardProps = {
  product: ProductWithMeta;
  userId?: string;
};

export function ProductCard({ product, userId }: ProductCardProps) {
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
          <CardTitle className="text-sm font-semibold capitalize flex items-center justify-between">
            <Link href={`/${product.slug}`} className="hover:text-violet-700 transition-colors">
              <h3>{product.factoryName}</h3>
            </Link>

            <Badge
              className="px-2 py-1 rounded-xs uppercase leading-none text-muted"
              variant={product.gender}
            >
              {product.gender === "male"
                ? "Erkek"
                : product.gender === "female"
                  ? "Kadın"
                  : "Unisex"}
            </Badge>
          </CardTitle>
          <CardDescription className="flex flex-col m-0">
            <span className="text-xs text-muted-foreground">Benzer Ürün:</span>
            <h4 className="leading-none text-sm font-medium">
              {product.brand + " " + product.perfume}
            </h4>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="flex flex-col gap-2">
            <p className="text-end leading-none font-medium">
              {formatPrice(product.price?.amountCents || 0)}{" "}
              <span className="text-muted-foreground text-xs">/50gr</span>
            </p>
            <div className="h-5 w-full bg-accent rounded-xs relative overflow-hidden">
              <div className="h-5 w-1/2 absolute left-0 bg-green-600 rounded-r-xs"></div>
              <p className="text-xs text-black leading-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-medium">
                500/1000gr
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2 p-0 mt-4">
          <Button className="flex-1 h-8 bg-violet-700 hover:cursor-pointer hover:bg-violet-600 rounded font-normal text-white">
            TALEP EKLE
          </Button>
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
