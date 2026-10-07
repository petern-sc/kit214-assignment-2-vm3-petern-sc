import { z } from "zod";

export const CreateInviteInputSchema = z.object({
  bookingId: z.uuid(),
  invitedUserId: z.uuid(),
});

export type CreateInviteInput = z.infer<typeof CreateInviteInputSchema>;
