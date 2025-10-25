"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function Filter() {
  const search = useSearchParams();
  //   console.log(search + "from next");
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = search?.get?.("capacity") ?? "all";
  function handleFilter(filter: string) {
    const params = new URLSearchParams(search);
    // console.log(params + "from browser");

    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex ">
      <Button
        handleFilter={handleFilter}
        filter={"all"}
        activeFilter={activeFilter}
        children={"All cabins"}
      />
      <Button
        handleFilter={handleFilter}
        filter={"small"}
        activeFilter={activeFilter}
        children={"1-3 guests"}
      />
      <Button
        handleFilter={handleFilter}
        filter={"medium"}
        activeFilter={activeFilter}
        children={"3-7guests"}
      />
      <Button
        handleFilter={handleFilter}
        filter={"large"}
        activeFilter={activeFilter}
        children={"8-12 guests"}
      />
    </div>
  );
}

function Button({
  filter,
  handleFilter,
  activeFilter,
  children,
}: {
  filter: string;
  handleFilter: (filter: string) => void;
  activeFilter: string;
  children: string;
}) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
    >
      {children}
    </button>
  );
}
