"use client";

import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filter() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = search?.get("capacity") ?? "all";

  function handleFilter(filter: string) {
    const params = new URLSearchParams(search);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}` as unknown as Route, {
      scroll: false,
    });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        handleFilter={handleFilter}
        filter="all"
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="small"
        activeFilter={activeFilter}
      >
        1-3 guests
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="medium"
        activeFilter={activeFilter}
      >
        3-7 guests
      </Button>
      <Button
        handleFilter={handleFilter}
        filter="large"
        activeFilter={activeFilter}
      >
        8-12 guests
      </Button>
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
  children: React.ReactNode;
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
