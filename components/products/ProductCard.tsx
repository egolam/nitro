import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";

export function ProductCard() {
  return (
    <Card className="h-96 rounded overflow-hidden">
      <div className="w-full relative h-1/2">
        <Image
          src="https://placehold.co/600x400"
          unoptimized
          fill
          alt="esans foto"
          className="object-cover"
        />
      </div>

      <CardHeader>
        <CardAction>
          <Badge variant="outline">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  );
}
