import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getProductBySlug } from "@/data/products/getProductBySlug";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProgressBar } from "@/components/products/ProgressBar";
import { AddOrderButton } from "@/components/products/AddOrderButton";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { calculateProductPricePerGram } from "@/helper/pricing";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const productSlug = slug[slug.length - 1];

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const product = await getProductBySlug(productSlug, session?.user.id);

  if (!product) {
    notFound();
  }

  return (
    <section className="flex flex-col sm:flex-row gap-4 max-w-5xl flex-1 pt-4">
      <div className="w-full sm:w-1/2">
        <div className="relative w-full aspect-square overflow-hidden rounded bg-muted-foreground">
          {product.image && (
            <Image
              src={product.image}
              alt={product.factoryName}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>
      <div className="h-fit w-full sm:w-1/2 flex flex-col bg-background border rounded p-4 gap-4">
        <div className="flex gap-2 md:items-end justify-between">
          <h2 className="leading-none text-2xl font-semibold text-violet-700">
            {product.factoryName}
          </h2>
          {product.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={tag.name as "male" | "female" | "unisex" | "unassigned"}
              className="px-2 rounded h-fit"
            >
              {tag.name.toUpperCase()}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-1 pr-4">
          <p className="text-sm text-muted-foreground leading-none">
            Benzer Ürün:
          </p>
          <p className="font-medium leading-none">
            {product.brand} {product.perfume}
          </p>
        </div>
        <div>
          <p className="text-xl font-medium">
            {calculateProductPricePerGram(
              product.price?.amount!,
              product.price?.vat!,
              product.price?.profitMargin!,
              product.price?.discount!,
              product.price?.exchangeRate!,
              product.minBuyGrams,
              product.minBuyThreshold,
            ).toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}{" "}
            <span className="text-xs text-muted-foreground">
              /{product.minBuyGrams}gr
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-sm text-violet-700 font-medium leading-none">
            Ürün detayları:
          </h3>
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-1">
              <h4 className="text-sm font-medium">Kategori:</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {product.gender === "male"
                  ? "Erkek"
                  : product.gender === "female"
                    ? "Kadın"
                    : "Unisex"}
              </p>
            </div>
            <div className="flex gap-1">
              <h4 className="text-sm font-medium">Ürün kodu:</h4>
              <p className="text-sm text-muted-foreground">{product.sku}</p>
            </div>
            {!product.certificates.length ? null : (
              <div className="flex gap-1">
                <h4 className="text-sm font-medium">Sertifikalar:</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {product.certificates.map((c) => c.name).join(", ")}
                </p>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-foreground/80">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid
              laborum ratione eveniet consequuntur. Dolor dicta eum repudiandae
              cumque.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <ProgressBar
            current={product.totalDemand}
            total={Math.max(
              product.minBuyThreshold,
              Math.ceil(product.totalDemand / product.minBuyThreshold) *
                product.minBuyThreshold,
            )}
            threshold={product.minBuyThreshold}
          />
          <div className="flex gap-2 items-center">
            <AddOrderButton
              productId={product.id}
              minBuyGrams={product.minBuyGrams}
            />
            {session?.user.id ? (
              <FavoriteButton
                productId={product.id}
                isFavorite={product.isFavorite}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
