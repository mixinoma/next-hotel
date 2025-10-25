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
  //   this is nextjs 16 convention to take out params which by default are of value string.
  const { name } = await getCabin(parseInt(cabinId));
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
  return ids;
}

// export const revalidate = 3600;

//NOTE ---->   page needs to be default export always, keep in mind .
export default async function Page({
  params,
}: {
  params: Promise<{ cabinId: string }>;
}) {
  const { cabinId } = await params;
  //   console.log(cabinId);
  const cabin = await getCabin(parseInt(cabinId));

  const { id, name, maxCapacity, regularPrice, discount, image, description } =
    cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve today. Pay on arrival.
        </h2>
      </div>
      <Suspense fallback={<Spinner />}>
        <Reservation cabin={cabin} />
      </Suspense>
    </div>
  );
}
