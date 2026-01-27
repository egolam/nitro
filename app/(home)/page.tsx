import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/helper/formatPrice";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { getProducts } from "@/data/products/getProducts";
import { Badge } from "@/components/ui/badge";
export default async function HomePage() {
  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });
  const data = await getProducts(session?.user.id);

  return (
    <section className="max-w-7xl flex-1 pt-4">
      <ul>
        {data.map((product) => (
          <li key={product.id} className="">
            <Card className="h-96 rounded overflow-hidden bg-background shadow-lg">
              <div className="w-full relative h-1/2 bg-input">
                <div className="absolute right-2 top-2 ">
                  {product.tags.map((tag) => (
                    <Badge
                      variant={tag.name}
                      key={tag.id}
                      className="px-2 py-1 rounded-xs uppercase leading-none"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <CardHeader className="gap-2">
                  <CardTitle className="text-sm font-semibold capitalize flex items-center justify-between">
                    <h3>{product.factoryName}</h3>
                    <Badge variant={product.gender}>{product.gender}</Badge>
                  </CardTitle>
                  <CardDescription className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Benzer Ürün:
                    </span>
                    <h4 className="leading-none text-sm font-medium">
                      {product.brand + " " + product.perfume}
                    </h4>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p className="text-end leading-none">
                      {formatPrice(product.price?.amount || 0)}{" "}
                      <span className="text-muted-foreground text-xs">
                        /50gr
                      </span>
                    </p>
                    <div className="h-5 w-full bg-accent rounded-xs relative overflow-hidden">
                      <div className="h-5 w-1/2 absolute left-0 bg-green-600 rounded-r-xs"></div>
                      <p className="text-xs text-black leading-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-medium">
                        500/1000gr
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button className="flex-1 h-8 bg-violet-700 hover:cursor-pointer hover:bg-violet-600 rounded font-normal">
                    TALEP EKLE
                  </Button>
                  {session ? (
                    <FavoriteButton
                      productId={product.id}
                      isFavorite={product.isFavorite}
                    />
                  ) : null}
                </CardFooter>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

{
  /* <div className="w-full relative h-1/2">
              <Image
                src={product.image as string}
                unoptimized
                fill
                alt="esans foto"
                className="object-cover"
              />
            </div>
            <div className="p-4 text-sm flex flex-col gap-2">
              <h3 className="capitalize font-semibold tracking-wide">
                {product.factoryName}
              </h3>
              <div>
                <div>
                  <p className="text-xs text-muted-foreground">Benzer Ürün</p>
                  <h4 className="capitalize font-medium leading-none">
                    {product.brand + " " + product.perfume}
                  </h4>
                </div>
                <div>
                  <p>
                    ₺125,65{" "}
                    <span className="text-xs text-muted-foreground">
                      /{product.minBuyGrams}gr
                    </span>
                  </p>
                </div>
              </div>
            </div> */
}
