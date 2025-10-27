import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ cabinId: string }>;
};

// this is for generating title dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cabinId } = await params;
  const { name } = await getCabin(parseInt(cabinId));
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
  return ids;
}

// export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ cabinId: string }>;
}) {
  const { cabinId } = await params;
  const cabin = await getCabin(parseInt(cabinId));

  // ✅ Ensure description is always a string
  const safeCabin = { ...cabin, description: cabin.description ?? "" };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={safeCabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve today. Pay on arrival.
        </h2>
      </div>
      <Suspense fallback={<Spinner />}>
        <Reservation cabin={safeCabin} />
      </Suspense>
    </div>
  );
}
