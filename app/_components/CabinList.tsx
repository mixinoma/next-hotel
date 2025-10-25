import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";
import { unstable_noStore } from "next/cache";

type CabinListPropType = { filter: "small" | "medium" | "all" | "large" };

export default async function CabinList({ filter }: CabinListPropType) {
  unstable_noStore();
  const cabins = await getCabins();
  let displayCabins;

  if (filter === "all") displayCabins = cabins;
  else if (filter === "medium") {
    displayCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  } else if (filter === "small") {
    displayCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  } else {
    displayCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
  }

  if (!cabins.length) return null;
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
