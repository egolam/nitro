import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log(slug);

  return (
    <section className="flex gap-4 max-w-5xl flex-1 pt-4">
      <div className="w-1/2">
        <div className="relative w-full aspect-square overflow-hidden rounded bg-muted-foreground">
          {/* <Image src="" alt="esans fotoğrafı" fill /> */}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-background border rounded p-4 gap-4">
        <div className="flex gap-2 items-end">
          <p className="leading-none text-2xl font-semibold text-violet-700">
            Yarraki Malaki
          </p>
          <Badge
            variant="male"
            className="px-2 rounded-xs uppercase leading-none text-muted text-sm"
          >
            Erkek
          </Badge>
          <Badge
            variant="delux"
            className="px-2 rounded-xs uppercase leading-none text-foreground text-sm"
          >
            Delux
          </Badge>
        </div>
        <div className="flex divide-x">
          <div className="flex flex-col gap-1 pr-4">
            <p className="text-sm text-muted-foreground leading-none">
              Benzer Ürün:
            </p>
            <p className="font-medium leading-none">Parf-me Leather Wood 37</p>
          </div>
          <div className="flex flex-col gap-1 pl-4">
            <p className="text-sm text-muted-foreground leading-none">
              Ürün Kodu:
            </p>
            <p className="font-medium leading-none">1598764</p>
          </div>
        </div>
      </div>
    </section>
  );
}
