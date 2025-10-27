"use server";

import { auth, signIn, signOut } from "./auth";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBookings } from "./data-service";
import { supabase } from "./supabse";

export async function updateGuest(formData: any) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestId = Number(session.user?.guestId);
  if (!guestId) throw new Error("Invalid guest ID");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function deleteReservation({ bookingId }: { bookingId: number }) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestId = Number(session.user?.guestId);
  if (!guestId) throw new Error("Invalid guest ID");

  const guestBookings = await getBookings(guestId);
  const getBookingIds = guestBookings.map((booking) => booking.id);

  if (!getBookingIds.includes(bookingId)) {
    throw new Error("not allowed to delele this booking");
  }
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: any) {
  const bookingId = Number(formData.get("bookingId"));

  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestId = Number(session.user?.guestId);
  if (!guestId) throw new Error("Invalid guest ID");

  const guestBookings = await getBookings(guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}
export async function singInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function singOutAction() {
  await signOut({ redirectTo: "/" });
}
